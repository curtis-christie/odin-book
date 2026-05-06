import { Router } from "express";

import {
  getFollowers,
  getFollowing,
  unfollowUser,
} from "../controllers/followController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { followUserIdParamsSchema } from "../schemas/followSchemas.js";

export const followRoutes = Router();

followRoutes.use(requireAuth);

followRoutes.get(
  "/followers/:userId",
  validateRequest(followUserIdParamsSchema),
  getFollowers,
);

followRoutes.get(
  "/following/:userId",
  validateRequest(followUserIdParamsSchema),
  getFollowing,
);

followRoutes.delete(
  "/:userId",
  validateRequest(followUserIdParamsSchema),
  unfollowUser,
);
