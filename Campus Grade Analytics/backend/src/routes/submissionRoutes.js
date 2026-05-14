import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createSubmissionController } from "../controllers/submissionController.js";
import { validateBody } from "../middleware/validate.js";
import { createSubmissionSchema } from "../validators/submissionValidators.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", validateBody(createSubmissionSchema), asyncHandler(createSubmissionController));
router.post("/authenticated", requireAuth, validateBody(createSubmissionSchema), asyncHandler(createSubmissionController));

export default router;

