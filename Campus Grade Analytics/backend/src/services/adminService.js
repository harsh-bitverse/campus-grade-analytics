import { stringify } from "csv-stringify/sync";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { runCleaningForCourse } from "./cleaningService.js";

export async function reviewFlag(flagId, adminId, action, notes = "") {
  const flag = await prisma.flaggedEntry.findUnique({
    where: { id: flagId },
    include: { submission: true }
  });

  if (!flag) {
    throw new ApiError(404, "Flagged entry not found");
  }

  const nextStatus = action === "approve" ? "ACCEPTED" : "REJECTED";

  await prisma.flaggedEntry.update({
    where: { id: flagId },
    data: {
      isResolved: true,
      reviewedById: adminId,
      details: {
        ...(flag.details || {}),
        adminNotes: notes,
        adminAction: action
      }
    }
  });

  await prisma.submission.update({
    where: { id: flag.submissionId },
    data: { status: nextStatus }
  });

  return { success: true };
}

export async function exportCourseSubmissions(courseId) {
  const rows = await prisma.submission.findMany({
    where: courseId ? { courseId } : undefined,
    include: {
      course: true,
      cleanedRecord: true
    },
    orderBy: { createdAt: "desc" }
  });

  return stringify(
    rows.map((row) => ({
      submissionId: row.id,
      courseCode: row.course.courseCode,
      semester: row.course.semester,
      totalMarks: row.totalMarks,
      originalGrade: row.originalGrade,
      normalizedGrade: row.normalizedGrade,
      status: row.status,
      suspicious: row.cleanedRecord?.isSuspicious ?? false,
      cleaningReason: row.cleanedRecord?.cleaningReason ?? ""
    })),
    { header: true }
  );
}

export { runCleaningForCourse };

