import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  getPostsByUserId,
  getUserById,
  getUsers,
  updateCurrentUser,
} from "../controllers/userController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  getUserByIdRequestSchema,
  getUserPostsRequestSchema,
  getUsersRequestSchema,
  updateCurrentUserSchema,
  userIdParamsSchema,
} from "../schemas/userSchemas.js";
import { paginationQuerySchema } from "../schemas/paginationSchemas.js";

export const userRoutes = Router();

userRoutes.use(requireAuth);

userRoutes.patch(
  "/me",
  validateRequest(updateCurrentUserSchema),
  updateCurrentUser,
);
userRoutes.get("/", validateRequest(getUsersRequestSchema), getUsers);

userRoutes.get(
  "/:userId/posts",
  validateRequest(getUserPostsRequestSchema),
  getPostsByUserId,
);
userRoutes.get(
  "/:userId",
  validateRequest(getUserByIdRequestSchema),
  getUserById,
);
