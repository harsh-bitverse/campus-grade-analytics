import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loginController, meController, signupController } from "../controllers/authController.js";
import { validateBody } from "../middleware/validate.js";
import { loginSchema, signupSchema } from "../validators/authValidators.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/signup", validateBody(signupSchema), asyncHandler(signupController));
router.post("/login", validateBody(loginSchema), asyncHandler(loginController));
router.get("/me", requireAuth, asyncHandler(meController));

export default router;

