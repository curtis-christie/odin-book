import { Router } from "express";

import {
  acceptFollowRequest,
  getIncomingFollowRequests,
  getOutgoingFollowRequests,
  rejectFollowRequest,
  sendFollowRequest,
} from "../controllers/followRequestController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  receiverIdParamsSchema,
  requestIdParamsSchema,
} from "../schemas/followRequestSchemas.js";

export const followRequestRoutes = Router();

followRequestRoutes.use(requireAuth);

followRequestRoutes.post(
  "/:receiverId",
  validateRequest(receiverIdParamsSchema),
  sendFollowRequest,
);

followRequestRoutes.get("/incoming", getIncomingFollowRequests);

followRequestRoutes.get("/outgoing", getOutgoingFollowRequests);

followRequestRoutes.patch(
  "/:requestId/accept",
  validateRequest(requestIdParamsSchema),
  acceptFollowRequest,
);

followRequestRoutes.patch(
  "/:requestId/reject",
  validateRequest(requestIdParamsSchema),
  rejectFollowRequest,
);
