import { Router } from "express";

import {
  createComment,
  getCommentsForPost,
} from "../controllers/commentController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createCommentSchema } from "../schemas/commentSchemas.js";
import { postIdParamsSchema } from "../schemas/postSchemas.js";

export const commentRoutes = Router();

commentRoutes.use(requireAuth);

commentRoutes.post(
  "/:postId/comments",
  validateRequest(postIdParamsSchema),
  validateRequest(createCommentSchema),
  createComment,
);

commentRoutes.get(
  "/:postId/comments",
  validateRequest(postIdParamsSchema),
  getCommentsForPost,
);
