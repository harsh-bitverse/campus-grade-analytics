import { prisma } from "../config/prisma.js";
import { sanitizeText } from "../utils/sanitize.js";
import { ApiError } from "../utils/ApiError.js";

export async function listCourses() {
  return prisma.course.findMany({
    where: { isArchived: false },
    orderBy: [{ semester: "desc" }, { courseCode: "asc" }]
  });
}

export async function createCourse(payload) {
  try {
    return await prisma.course.create({
      data: {
        courseCode: sanitizeText(payload.courseCode).toUpperCase(),
        courseName: sanitizeText(payload.courseName),
        semester: sanitizeText(payload.semester),
        professor: sanitizeText(payload.professor) || null
      }
    });
  } catch (error) {
    throw new ApiError(409, "Course code and semester combination already exists");
  }
}

export async function updateCourse(courseId, payload) {
  const existingCourse = await prisma.course.findUnique({ where: { id: courseId } });

  if (!existingCourse) {
    throw new ApiError(404, "Course not found");
  }

  return prisma.course.update({
    where: { id: courseId },
    data: {
      courseCode: payload.courseCode ? sanitizeText(payload.courseCode).toUpperCase() : undefined,
      courseName: payload.courseName ? sanitizeText(payload.courseName) : undefined,
      semester: payload.semester ? sanitizeText(payload.semester) : undefined,
      professor: payload.professor !== undefined ? sanitizeText(payload.professor) || null : undefined,
      isArchived: payload.isArchived
    }
  });
}

