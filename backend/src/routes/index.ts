import { Router } from "express";

import { healthRoutes } from "./healthRoutes.js";
import { authRoutes } from "./authRoutes.js";
import { userRoutes } from "./userRoutes.js";
import { postRoutes } from "./postRoutes.js";
import { likeRoutes } from "./likeRoutes.js";
import { commentRoutes } from "./commentRoutes.js";

export const apiRoutes = Router();

apiRoutes.use("/health", healthRoutes);
apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/users", userRoutes);
apiRoutes.use("/posts", postRoutes);
apiRoutes.use("/posts", likeRoutes);
apiRoutes.use("/posts", commentRoutes);
apiRoutes.use("/comments", commentRoutes);
