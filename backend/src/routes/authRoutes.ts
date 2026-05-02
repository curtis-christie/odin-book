import { Router } from "express";

import { login, register } from "../controllers/authController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { loginSchema, registerSchema } from "../schemas/authSchemas.js";

export const authRoutes = Router();

authRoutes.post("/register", validateRequest(registerSchema), register);
authRoutes.post("/login", validateRequest(loginSchema), login);
