import type { Request, Response } from "express";

import { prisma } from "../db/prisma.js";
import { AppError } from "../utils/AppError.js";
import { getAuthUser } from "../utils/getAuthUser.js";

/* =========================================================
  A. LIKE POST
   ========================================================= */
export async function likePost(
  req: Request,
  res: Response,
): Promise<void> {
  const authUser = getAuthUser(req);
  const { postId } = req.params;

  if (typeof postId !== "string") {
    throw new AppError("Post not found", 404);
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
    },
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId: authUser.id,
      },
    },
  });

  if (existingLike) {
    throw new AppError("Post already liked", 409);
  }

  await prisma.like.create({
    data: {
      postId,
      userId: authUser.id,
    },
  });

  const likeCount = await prisma.like.count({
    where: {
      postId,
    },
  });

  res.status(201).json({
    message: "Post liked",
    postId,
    likeCount,
  });
}

/* =========================================================
  B. UNLIKE POST
   ========================================================= */
export async function unlikePost(
  req: Request,
  res: Response,
): Promise<void> {
  const authUser = getAuthUser(req);
  const { postId } = req.params;

  if (typeof postId !== "string") {
    throw new AppError("Post not found", 404);
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
    },
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId: authUser.id,
      },
    },
  });

  if (!existingLike) {
    throw new AppError("Post is not liked", 404);
  }

  await prisma.like.delete({
    where: {
      postId_userId: {
        postId,
        userId: authUser.id,
      },
    },
  });

  const likeCount = await prisma.like.count({
    where: {
      postId,
    },
  });

  res.status(200).json({
    message: "Post unliked",
    postId,
    likeCount,
  });
}
