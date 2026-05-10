import { Router } from "express";

import {
  createComment,
  getCommentsForPost,
} from "../controllers/commentController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createCommentSchema } from "../schemas/commentSchemas.js";
import { postIdParamsSchema } from "../schemas/postSchemas.js";
import { paginationQuerySchema } from "../schemas/paginationSchemas.js";

export const postCommentRouter = Router();

postCommentRouter.use(requireAuth);

postCommentRouter.post(
  "/:postId/comments",
  validateRequest(postIdParamsSchema),
  validateRequest(createCommentSchema),
  createComment,
);

postCommentRouter.get(
  "/:postId/comments",
  validateRequest(postIdParamsSchema),
  validateRequest(paginationQuerySchema),
  getCommentsForPost,
);
