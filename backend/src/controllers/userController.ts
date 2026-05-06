import type { Request, Response } from "express";

import { prisma } from "../db/prisma.js";
import type {
  UpdateCurrentUserInput,
  UserIdParams,
} from "../schemas/userSchemas.js";
import { AppError } from "../utils/AppError.js";
import { getAuthUser } from "../utils/getAuthUser.js";
import {
  toPublicUser,
  toPublicUserWithRelationship,
  toSafeUser,
  type RelationshipStatus,
} from "../utils/userMappers.js";
import { FollowRequestStatus } from "../generated/prisma/client.js";
import { toPublicPost } from "../utils/postMappers.js";

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

const postInclude = {
  author: true,
  _count: {
    select: {
      likes: true,
      comments: true,
    },
  },
} as const;

async function getRelationshipStatus(
  authUserId: string,
  targetUserId: string,
): Promise<RelationshipStatus> {
  if (targetUserId === authUserId) {
    return "SELF";
  }

  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: authUserId,
        followingId: targetUserId,
      },
    },
    select: {
      id: true,
    },
  });

  if (follow) {
    return "FOLLOWING";
  }

  const pendingRequest = await prisma.followRequest.findUnique({
    where: {
      senderId_receiverId: {
        senderId: authUserId,
        receiverId: targetUserId,
      },
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (pendingRequest?.status === FollowRequestStatus.PENDING) {
    return "PENDING";
  }

  return "NONE";
}

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

  function getRelationshipStatusFromSets(
    userId: string,
  ): RelationshipStatus {
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
        getRelationshipStatusFromSets(user.id),
      );
    }),
  });
}

/* =========================================================
  B. GET USER BY ID
   ========================================================= */

export async function getUserById(
  req: Request,
  res: Response,
): Promise<void> {
  const authUser = getAuthUser(req);
  const { userId } = req.params as UserIdParams;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: publicUserSelect,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const relationshipStatus = await getRelationshipStatus(
    authUser.id,
    user.id,
  );

  const publicUser = toPublicUser(user);

  res.status(200).json({
    user: toPublicUserWithRelationship(publicUser, relationshipStatus),
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

/* =========================================================
  D. GET POSTS BY USER ID
   ========================================================= */

export async function getPostsByUserId(
  req: Request,
  res: Response,
): Promise<void> {
  getAuthUser(req);

  const { userId } = req.params as UserIdParams;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const posts = await prisma.post.findMany({
    where: {
      authorId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: postInclude,
  });

  res.status(200).json({
    posts: posts.map(toPublicPost),
  });
}
