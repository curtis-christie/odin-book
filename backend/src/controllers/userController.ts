import type { Request, Response } from "express";

import { prisma } from "../db/prisma.js";
import type { UpdateCurrentUserInput } from "../schemas/userSchemas.js";
import { AppError } from "../utils/AppError.js";
import { getAuthUser } from "../utils/getAuthUser.js";
import {
  toPublicUser,
  toPublicUserWithRelationship,
  toSafeUser,
  type RelationshipStatus,
} from "../utils/userMappers.js";
import { FollowRequestStatus } from "../generated/prisma/enums.js";

const publicUserSelect = {
  id: true,
  username: true,
  firstName: true,
  lastName: true,
  bio: true,
  profileImageUrl: true,
  createdAt: true,
  updatedAt: true,
} as const;

/* =========================================================
  A. GET USERS
   ========================================================= */

export async function getUsers(
  req: Request,
  res: Response,
): Promise<void> {
  const authUser = getAuthUser(req);

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: publicUserSelect,
  });

  const follows = await prisma.follow.findMany({
    where: {
      followerId: authUser.id,
    },
    select: {
      followingId: true,
    },
  });

  const pendingRequests = await prisma.followRequest.findMany({
    where: {
      senderId: authUser.id,
      status: FollowRequestStatus.PENDING,
    },
    select: {
      receiverId: true,
    },
  });

  const followingIds = new Set(
    follows.map((follow) => follow.followingId),
  );

  const pendingReceiverIds = new Set(
    pendingRequests.map((request) => request.receiverId),
  );

  function getRelationshipStatus(userId: string): RelationshipStatus {
    if (userId === authUser.id) {
      return "SELF";
    }

    if (followingIds.has(userId)) {
      return "FOLLOWING";
    }

    if (pendingReceiverIds.has(userId)) {
      return "PENDING";
    }

    return "NONE";
  }

  res.status(200).json({
    users: users.map((user) => {
      const publicUser = toPublicUser(user);

      return toPublicUserWithRelationship(
        publicUser,
        getRelationshipStatus(user.id),
      );
    }),
  });
}

/* =========================================================
  B. GET USER BY ID
   ========================================================= */

export async function getUserById(req: Request, res: Response) {
  const { userId } = req.params;

  if (typeof userId !== "string") {
    throw new AppError("User not found", 404);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json({
    user: toPublicUser(user),
  });
}

/* =========================================================
  C. UPDATE CURRENT USER
   ========================================================= */

export async function updateCurrentUser(req: Request, res: Response) {
  const authUser = getAuthUser(req);
  const input = req.body as UpdateCurrentUserInput;

  const updatedUser = await prisma.user.update({
    where: {
      id: authUser.id,
    },
    data: input,
  });

  res.json({
    user: toSafeUser(updatedUser),
  });
}
