import { Router } from "express";
import { login, logout } from "../controllers/AuthController.js";
import { loginLimiter } from "../middlewares/rateLimiter.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema } from "../schemas/authSchema.js";

const router = Router();

router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/logout", logout);

export default router;