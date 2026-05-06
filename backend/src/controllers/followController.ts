import type { Request, Response } from "express";

import { prisma } from "../db/prisma.js";
import type { FollowUserIdParams } from "../schemas/followSchemas.js";
import { AppError } from "../utils/AppError.js";
import { getAuthUser } from "../utils/getAuthUser.js";

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
  A. GET FOLLOWERS
   ========================================================= */

export async function getFollowers(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as FollowUserIdParams;

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

  const followers = await prisma.follow.findMany({
    where: {
      followingId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      follower: {
        select: publicUserSelect,
      },
    },
  });

  res.status(200).json({
    followers: followers.map((follow) => follow.follower),
  });
}

/* =========================================================
  B. GET FOLLOWING
   ========================================================= */

export async function getFollowing(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as FollowUserIdParams;

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

  const following = await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      following: {
        select: publicUserSelect,
      },
    },
  });

  res.status(200).json({
    following: following.map((follow) => follow.following),
  });
}

/* =========================================================
  C. UNFOLLOW USER
   ========================================================= */

export async function unfollowUser(req: Request, res: Response): Promise<void> {
  const authUser = getAuthUser(req);
  const { userId } = req.params as FollowUserIdParams;

  if (userId === authUser.id) {
    throw new AppError("You cannot unfollow yourself", 400);
  }

  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: authUser.id,
        followingId: userId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!follow) {
    throw new AppError("You are not following this user", 404);
  }

  await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId: authUser.id,
        followingId: userId,
      },
    },
  });

  res.status(200).json({
    message: "User unfollowed",
    userId,
  });
}
