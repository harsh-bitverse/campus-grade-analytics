import { z } from "zod";

export const createSubmissionSchema = z.object({
  courseId: z.string().min(1),
  totalMarks: z.number().min(0).max(100),
  obtainedGrade: z.string().min(1).max(5),
  isAnonymous: z.boolean().default(true)
});

export const reviewFlagSchema = z.object({
  action: z.enum(["approve", "reject"]),
  notes: z.string().max(300).optional()
});

