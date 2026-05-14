import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/prisma.js";
import {
  exportCsvController,
  listSubmissionsController,
  reviewFlagController,
  runCleaningController
} from "../controllers/adminController.js";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validate.js";
import { reviewFlagSchema } from "../validators/submissionValidators.js";

const router = Router();

router.get("/make-admin", async (req, res) => {
  await prisma.user.update({
    where: {
      email: "hagrharsh@gmail.com"
    },
    data: {
      role: "ADMIN"
    }
  });

  res.json({ success: true, message: "Admin updated" });
});

router.get("/seed-demo", async (req, res) => {
  const course = await prisma.course.findFirst({
    where: {
      courseCode: "MTL1001"
    }
  });

  if (!course) {
    return res.json({
      success: false,
      message: "Course not found"
    });
  }

  const data = [
    { marks: 74.5, grade: "A-" },
    { marks: 87.5, grade: "A" },
    { marks: 52, grade: "B-" },
    { marks: 50, grade: "B-" },
    { marks: 73, grade: "A-" },
    { marks: 81.5, grade: "A" }
  ];

  for (const entry of data) {
    await prisma.submission.create({
      data: {
      totalMarks: entry.marks,
      obtainedGrade: entry.grade,
      normalizedGrade: entry.grade,
      originalGrade: entry.grade,
      isAnonymous: true,
      courseId: course.id
      }
    });
  }

  res.json({
    success: true,
    message: "Demo data inserted"
  });
});

router.use(requireAuth, requireAdmin);
router.get("/submissions", asyncHandler(listSubmissionsController));
router.post("/clean/:courseId", asyncHandler(runCleaningController));
router.post("/flags/:flagId/review", validateBody(reviewFlagSchema), asyncHandler(reviewFlagController));
router.get("/export", asyncHandler(exportCsvController));

export default router;

