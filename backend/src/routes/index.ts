import { Router } from "express";

import { healthRoutes } from "./healthRoutes.js";
import { authRoutes } from "./authRoutes.js";
import { userRoutes } from "./userRoutes.js";

export const apiRoutes = Router();

apiRoutes.use("/health", healthRoutes);
apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/users", userRoutes);
