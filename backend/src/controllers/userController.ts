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
import type { PaginationQuery } from "../schemas/paginationSchemas.js";
import {
  createPaginationMeta,
  getPaginationOffset,
} from "../utils/pagination.js";
import { publicUserSelect } from "../utils/userSelects.js";

const postInclude = {
  author: {
    select: publicUserSelect,
  },
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
  const paginationQuery = req.query as unknown as PaginationQuery;
  const skip = getPaginationOffset(paginationQuery);

  const [users, totalCount, follows, pendingRequests] =
    await prisma.$transaction([
      prisma.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: paginationQuery.limit,
        select: publicUserSelect,
      }),
      prisma.user.count(),
      prisma.follow.findMany({
        where: {
          followerId: authUser.id,
        },
        select: {
          followingId: true,
        },
      }),
      prisma.followRequest.findMany({
        where: {
          senderId: authUser.id,
          status: FollowRequestStatus.PENDING,
        },
        select: {
          receiverId: true,
        },
      }),
    ]);

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
    pagination: createPaginationMeta(paginationQuery, totalCount),
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
  C. GET POSTS BY USER ID
   ========================================================= */

export async function getPostsByUserId(
  req: Request,
  res: Response,
): Promise<void> {
  getAuthUser(req);

  const { userId } = req.params as UserIdParams;
  const paginationQuery = req.query as unknown as PaginationQuery;
  const skip = getPaginationOffset(paginationQuery);

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

  const where = {
    authorId: userId,
  };

  const [posts, totalCount] = await prisma.$transaction([
    prisma.post.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: paginationQuery.limit,
      include: postInclude,
    }),
    prisma.post.count({
      where,
    }),
  ]);

  res.status(200).json({
    posts: posts.map(toPublicPost),
    pagination: createPaginationMeta(paginationQuery, totalCount),
  });
}

/* =========================================================
  D. UPDATE CURRENT USER
   ========================================================= */

export async function updateCurrentUser(
  req: Request,
  res: Response,
): Promise<void> {
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
