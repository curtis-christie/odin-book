import { Router } from "express";

import {
  createPost,
  deletePost,
  getFeedPosts,
  getPostById,
  updatePost,
} from "../controllers/postController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createPostSchema,
  postIdParamsSchema,
  updatePostSchema,
} from "../schemas/postSchemas.js";

export const postRoutes = Router();

postRoutes.use(requireAuth);

postRoutes.post("/", validateRequest(createPostSchema), createPost);
postRoutes.get("/feed", getFeedPosts);

postRoutes.get(
  "/:postId",
  validateRequest(postIdParamsSchema),
  getPostById,
);
postRoutes.patch(
  "/:postId",
  validateRequest(postIdParamsSchema),
  validateRequest(updatePostSchema),
  updatePost,
);
postRoutes.delete(
  "/:postId",
  validateRequest(postIdParamsSchema),
  deletePost,
);
