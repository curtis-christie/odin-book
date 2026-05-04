import { Router } from "express";

import {
  createPost,
  getFeedPosts,
  getPostById,
} from "../controllers/postController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createPostSchema,
  postIdParamsSchema,
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
