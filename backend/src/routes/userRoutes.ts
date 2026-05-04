import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  getUserById,
  getUsers,
  updateCurrentUser,
} from "../controllers/userController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { updateCurrentUserSchema } from "../schemas/userSchemas.js";

export const userRoutes = Router();

userRoutes.use(requireAuth);

userRoutes.patch(
  "/me",
  validateRequest(updateCurrentUserSchema),
  updateCurrentUser,
);
userRoutes.get("/", getUsers);
userRoutes.get("/:userId", getUserById);
