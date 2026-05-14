import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
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

router.use(requireAuth, requireAdmin);
router.get("/submissions", asyncHandler(listSubmissionsController));
router.post("/clean/:courseId", asyncHandler(runCleaningController));
router.post("/flags/:flagId/review", validateBody(reviewFlagSchema), asyncHandler(reviewFlagController));
router.get("/export", asyncHandler(exportCsvController));

export default router;

