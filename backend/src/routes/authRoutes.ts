import { Router } from "express";

import { register } from "../controllers/authController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { registerSchema } from "../schemas/authSchemas.js";

export const authRoutes = Router();

authRoutes.post("/register", validateRequest(registerSchema), register);
