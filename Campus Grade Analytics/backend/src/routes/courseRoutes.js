import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createCourseController,
  listCoursesController,
  updateCourseController
} from "../controllers/courseController.js";
import { requireAdmin, requireAuth } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validate.js";
import { createCourseSchema, updateCourseSchema } from "../validators/courseValidators.js";

const router = Router();

router.get("/", asyncHandler(listCoursesController));
router.post("/", requireAuth, requireAdmin, validateBody(createCourseSchema), asyncHandler(createCourseController));
router.put(
  "/:courseId",
  requireAuth,
  requireAdmin,
  validateBody(updateCourseSchema),
  asyncHandler(updateCourseController)
);

export default router;

