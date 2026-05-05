import type { Request, Response } from "express";

import { prisma } from "../db/prisma.js";
import type { CreateCommentInput } from "../schemas/commentSchemas.js";
import { AppError } from "../utils/AppError.js";
import { toPublicComment } from "../utils/commentMappers.js";
import { getAuthUser } from "../utils/getAuthUser.js";

const commentInclude = {
  author: true,
} as const;

/* =========================================================
  A. CREATE COMMENT
   ========================================================= */

export async function createComment(
  req: Request,
  res: Response,
): Promise<void> {
  const authUser = getAuthUser(req);
  const { postId } = req.params;
  const { content } = req.body as CreateCommentInput;

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

  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: authUser.id,
    },
    include: commentInclude,
  });

  res.status(201).json({
    comment: toPublicComment(comment),
  });
}

/* =========================================================
  B. GET COMMENTS FOR POST
   ========================================================= */

export async function getCommentsForPost(
  req: Request,
  res: Response,
): Promise<void> {
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

  const comments = await prisma.comment.findMany({
    where: {
      postId,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: commentInclude,
  });

  res.status(200).json({
    comments: comments.map(toPublicComment),
  });
}
