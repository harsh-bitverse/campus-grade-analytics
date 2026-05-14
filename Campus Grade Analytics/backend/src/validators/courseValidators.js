import { z } from "zod";

export const createCourseSchema = z.object({
  courseCode: z.string().min(2).max(20),
  courseName: z.string().min(3).max(120),
  semester: z.string().min(3).max(40),
  professor: z.string().max(80).optional().or(z.literal(""))
});

export const updateCourseSchema = createCourseSchema.partial().extend({
  isArchived: z.boolean().optional()
});

