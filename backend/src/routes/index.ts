import { Router } from "express";

import { healthRoutes } from "./healthRoutes.js";
import { authRoutes } from "./authRoutes.js";
import { userRoutes } from "./userRoutes.js";
import { postRoutes } from "./postRoutes.js";

export const apiRoutes = Router();

apiRoutes.use("/health", healthRoutes);
apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/users", userRoutes);
apiRoutes.use("/posts", postRoutes);
