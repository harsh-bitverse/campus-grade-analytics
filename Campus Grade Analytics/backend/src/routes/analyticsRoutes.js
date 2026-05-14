import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getCourseAnalyticsController } from "../controllers/analyticsController.js";

const router = Router();

router.get("/courses/:courseId", asyncHandler(getCourseAnalyticsController));

export default router;

