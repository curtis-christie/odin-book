import { Router } from "express";

import { likePost, unlikePost } from "../controllers/likeController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { postIdParamsSchema } from "../schemas/postSchemas.js";

export const likeRoutes = Router();

likeRoutes.use(requireAuth);

likeRoutes.post(
  "/:postId/likes",
  validateRequest(postIdParamsSchema),
  likePost,
);
likeRoutes.delete(
  "/:postId/likes",
  validateRequest(postIdParamsSchema),
  unlikePost,
);
