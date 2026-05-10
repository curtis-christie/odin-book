import type { Request, Response } from "express";

import { FollowRequestStatus } from "../generated/prisma/client.js";
import { prisma } from "../db/prisma.js";
import type {
  ReceiverIdParams,
  RequestIdParams,
} from "../schemas/followRequestSchemas.js";
import { AppError } from "../utils/AppError.js";
import { getAuthUser } from "../utils/getAuthUser.js";
import { publicUserSelect } from "../utils/userSelects.js";

/* =========================================================
  A. SEND FOLLOW REQUEST
   ========================================================= */

export async function sendFollowRequest(
  req: Request,
  res: Response,
): Promise<void> {
  const authUser = getAuthUser(req);
  const { receiverId } = req.params as ReceiverIdParams;

  if (receiverId === authUser.id) {
    throw new AppError(
      "You cannot send a follow request to yourself",
      400,
    );
  }

  const receiver = await prisma.user.findUnique({
    where: {
      id: receiverId,
    },
    select: {
      id: true,
    },
  });

  if (!receiver) {
    throw new AppError("User not found", 404);
  }

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: authUser.id,
        followingId: receiverId,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingFollow) {
    throw new AppError("You are already following this user", 409);
  }

  const existingRequest = await prisma.followRequest.findUnique({
    where: {
      senderId_receiverId: {
        senderId: authUser.id,
        receiverId,
      },
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (existingRequest?.status === FollowRequestStatus.PENDING) {
    throw new AppError("Follow request already sent", 409);
  }

  const followRequest = await prisma.followRequest.upsert({
    where: {
      senderId_receiverId: {
        senderId: authUser.id,
        receiverId,
      },
    },
    update: {
      status: FollowRequestStatus.PENDING,
    },
    create: {
      senderId: authUser.id,
      receiverId,
    },
  });

  res.status(201).json({
    followRequest,
  });
}

/* =========================================================
  B. GET INCOMING FOLLOW REQUESTS
   ========================================================= */

export async function getIncomingFollowRequests(
  req: Request,
  res: Response,
): Promise<void> {
  const authUser = getAuthUser(req);

  const followRequests = await prisma.followRequest.findMany({
    where: {
      receiverId: authUser.id,
      status: FollowRequestStatus.PENDING,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      sender: {
        select: publicUserSelect,
      },
    },
  });

  res.status(200).json({
    followRequests,
  });
}

/* =========================================================
  C. GET OUTGOING FOLLOW REQUESTS
   ========================================================= */

export async function getOutgoingFollowRequests(
  req: Request,
  res: Response,
): Promise<void> {
  const authUser = getAuthUser(req);

  const followRequests = await prisma.followRequest.findMany({
    where: {
      senderId: authUser.id,
      status: FollowRequestStatus.PENDING,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      receiver: {
        select: publicUserSelect,
      },
    },
  });

  res.status(200).json({
    followRequests,
  });
}

/* =========================================================
  D. ACCEPT FOLLOW REQUEST
   ========================================================= */

export async function acceptFollowRequest(
  req: Request,
  res: Response,
): Promise<void> {
  const authUser = getAuthUser(req);
  const { requestId } = req.params as RequestIdParams;

  const followRequest = await prisma.followRequest.findUnique({
    where: {
      id: requestId,
    },
  });

  if (!followRequest) {
    throw new AppError("Follow request not found", 404);
  }

  if (followRequest.receiverId !== authUser.id) {
    throw new AppError(
      "You are not allowed to respond to this follow request",
      403,
    );
  }

  if (followRequest.status !== FollowRequestStatus.PENDING) {
    throw new AppError("Follow request has already been handled", 409);
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedFollowRequest = await tx.followRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: FollowRequestStatus.ACCEPTED,
      },
    });

    const follow = await tx.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: followRequest.senderId,
          followingId: followRequest.receiverId,
        },
      },
      update: {},
      create: {
        followerId: followRequest.senderId,
        followingId: followRequest.receiverId,
      },
    });

    return {
      followRequest: updatedFollowRequest,
      follow,
    };
  });

  res.status(200).json(result);
}

/* =========================================================
  E. REJECT FOLLOW REQUEST
   ========================================================= */

export async function rejectFollowRequest(
  req: Request,
  res: Response,
): Promise<void> {
  const authUser = getAuthUser(req);
  const { requestId } = req.params as RequestIdParams;

  const followRequest = await prisma.followRequest.findUnique({
    where: {
      id: requestId,
    },
  });

  if (!followRequest) {
    throw new AppError("Follow request not found", 404);
  }

  if (followRequest.receiverId !== authUser.id) {
    throw new AppError(
      "You are not allowed to respond to this follow request",
      403,
    );
  }

  if (followRequest.status !== FollowRequestStatus.PENDING) {
    throw new AppError("Follow request has already been handled", 409);
  }

  const updatedFollowRequest = await prisma.followRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status: FollowRequestStatus.REJECTED,
    },
  });

  res.status(200).json({
    followRequest: updatedFollowRequest,
  });
}
