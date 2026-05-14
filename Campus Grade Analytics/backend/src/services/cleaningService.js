import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { POINTS_TO_GRADE } from "../utils/gradeUtils.js";
import { ApiError } from "../utils/ApiError.js";

function runPythonCleaner(payload) {
  return new Promise((resolve, reject) => {
    const currentFile = fileURLToPath(import.meta.url);
    const backendRoot = path.resolve(path.dirname(currentFile), "../../");
    const scriptPath = path.resolve(backendRoot, "../python/grade_cleaner/main.py");

    const pythonProcess = spawn(env.PYTHON_BIN, [scriptPath], {
      cwd: backendRoot
    });

    let stdout = "";
    let stderr = "";

    pythonProcess.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    pythonProcess.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(new ApiError(500, "Python cleaning engine failed", stderr || stdout));
        return;
      }

      try {
        resolve(JSON.parse(stdout));
      } catch (error) {
        reject(new ApiError(500, "Python cleaning engine returned invalid JSON", stdout));
      }
    });

    pythonProcess.on("error", (error) => {
      reject(new ApiError(500, "Could not start Python cleaning engine", error.message));
    });

    pythonProcess.stdin.write(JSON.stringify(payload));
    pythonProcess.stdin.end();
  });
}

export async function runCleaningForCourse(courseId) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const submissions = await prisma.submission.findMany({
    where: { courseId },
    orderBy: { totalMarks: "asc" }
  });

  const rawPayload = submissions.map((submission) => ({
    id: submission.id,
    totalMarks: submission.totalMarks,
    originalGrade: submission.originalGrade,
    normalizedGrade: submission.normalizedGrade,
    createdAt: submission.createdAt
  }));

  const result = await runPythonCleaner({
    course: {
      id: course.id,
      courseCode: course.courseCode,
      courseName: course.courseName,
      semester: course.semester
    },
    submissions: rawPayload
  });

  await prisma.$transaction([
    prisma.cleanedSubmission.deleteMany({
      where: {
        submission: {
          courseId
        }
      }
    }),
    prisma.estimatedCutoff.deleteMany({ where: { courseId } }),
    prisma.flaggedEntry.deleteMany({ where: { courseId } })
  ]);

  for (const row of result.cleaned_submissions) {
    await prisma.cleanedSubmission.create({
      data: {
        submissionId: row.id,
        cleanedMarks: row.cleaned_marks,
        cleanedGrade: row.cleaned_grade,
        isSuspicious: row.is_suspicious,
        cleaningReason: row.cleaning_reason,
        confidenceHint: row.confidence_hint
      }
    });

    await prisma.submission.update({
      where: { id: row.id },
      data: {
        status: row.is_suspicious ? "FLAGGED" : "ACCEPTED"
      }
    });
  }

  for (const flag of result.flagged_entries) {
    await prisma.flaggedEntry.create({
      data: {
        submissionId: flag.id,
        courseId,
        reason: flag.reason,
        severity: flag.severity,
        details: flag.details
      }
    });
  }

  for (const cutoff of result.estimated_cutoffs) {
    await prisma.estimatedCutoff.create({
      data: {
        courseId,
        gradeValue: cutoff.grade_value,
        gradeLabel: POINTS_TO_GRADE[cutoff.grade_value],
        estimatedLowerMark: cutoff.estimated_lower_mark,
        highestBelowMark: cutoff.highest_below_mark,
        confidenceScore: cutoff.confidence_score,
        sampleSize: cutoff.sample_size
      }
    });
  }

  return result;
}

export async function getCourseAnalytics(courseId) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      estimatedCutoffs: {
        orderBy: { gradeValue: "desc" }
      },
      submissions: true,
      flaggedEntries: {
        where: { isResolved: false }
      }
    }
  });

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const gradeDistribution = course.submissions.reduce((accumulator, submission) => {
    accumulator[submission.originalGrade] = (accumulator[submission.originalGrade] || 0) + 1;
    return accumulator;
  }, {});

  const histogramBuckets = Array.from({ length: 10 }, (_, index) => {
    const start = index * 10;
    const end = start + 9.99;
    const count = course.submissions.filter(
      (submission) => submission.totalMarks >= start && submission.totalMarks < start + 10
    ).length;

    return {
      range: `${start}-${Math.floor(end)}`,
      count
    };
  });

  return {
    course: {
      id: course.id,
      courseCode: course.courseCode,
      courseName: course.courseName,
      semester: course.semester,
      professor: course.professor
    },
    metrics: {
      totalResponses: course.submissions.length,
      flaggedResponses: course.flaggedEntries.length
    },
    estimatedCutoffs: course.estimatedCutoffs,
    gradeDistribution: Object.entries(gradeDistribution).map(([grade, count]) => ({ grade, count })),
    markHistogram: histogramBuckets
  };
}
