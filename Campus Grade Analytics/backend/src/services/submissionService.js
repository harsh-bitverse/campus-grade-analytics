import { prisma } from "../config/prisma.js";
import { createSubmissionHash } from "../utils/hashUtils.js";
import { normalizeGrade } from "../utils/gradeUtils.js";
import { ApiError } from "../utils/ApiError.js";

export async function createSubmission(payload, user) {
  const course = await prisma.course.findUnique({
    where: { id: payload.courseId }
  });

  if (!course || course.isArchived) {
    throw new ApiError(404, "Active course not found");
  }

  const normalizedGrade = normalizeGrade(payload.obtainedGrade);

  if (normalizedGrade === null || normalizedGrade < 4) {
    throw new ApiError(400, "Only grades from D to A are accepted");
  }

  const submissionHash = createSubmissionHash({
    courseId: payload.courseId,
    totalMarks: payload.totalMarks,
    originalGrade: payload.obtainedGrade,
    userId: payload.isAnonymous ? null : user?.id ?? null
  });

  const existingSubmission = await prisma.submission.findFirst({
    where: {
      courseId: payload.courseId,
      submissionHash
    }
  });

  if (existingSubmission) {
    throw new ApiError(409, "Duplicate submission detected");
  }

  return prisma.submission.create({
    data: {
      courseId: payload.courseId,
      userId: payload.isAnonymous ? null : user?.id ?? null,
      totalMarks: payload.totalMarks,
      originalGrade: payload.obtainedGrade.trim().toUpperCase(),
      normalizedGrade,
      isAnonymous: payload.isAnonymous,
      submissionHash
    }
  });
}

export async function listSubmissionsForAdmin(courseId) {
  return prisma.submission.findMany({
    where: courseId ? { courseId } : undefined,
    include: {
      course: true,
      cleanedRecord: true,
      flaggedEntries: true
    },
    orderBy: { createdAt: "desc" }
  });
}

