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
router.use(requireAuth, requireAdmin);
router.get("/submissions", asyncHandler(listSubmissionsController));
router.post("/clean/:courseId", asyncHandler(runCleaningController));
router.post("/flags/:flagId/review", validateBody(reviewFlagSchema), asyncHandler(reviewFlagController));
router.get("/export", asyncHandler(exportCsvController));

export default router;

