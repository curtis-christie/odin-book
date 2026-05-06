import type { Request, Response } from "express";

import { prisma } from "../db/prisma.js";
import type {
  CreateCommentInput,
  UpdateCommentInput,
} from "../schemas/commentSchemas.js";
import { AppError } from "../utils/AppError.js";
import { toPublicComment } from "../utils/commentMappers.js";
import { getAuthUser } from "../utils/getAuthUser.js";

const commentInclude = {
  author: true,
} as const;

async function getCommentForModification(commentId: string, authUserId: string) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  if (comment.authorId !== authUserId) {
    throw new AppError("You are not allowed to modify this comment", 403);
  }

  return comment;
}

/* =========================================================
  A. CREATE COMMENT
   ========================================================= */

export async function createComment(req: Request, res: Response): Promise<void> {
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

/* =========================================================
  C. UPDATE COMMENT
   ========================================================= */

export async function updateComment(req: Request, res: Response): Promise<void> {
  const authUser = getAuthUser(req);
  const { commentId } = req.params;
  const { content } = req.body as UpdateCommentInput;

  if (typeof commentId !== "string") {
    throw new AppError("Comment not found", 404);
  }

  await getCommentForModification(commentId, authUser.id);

  const updatedComment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content,
    },
    include: commentInclude,
  });

  res.status(200).json({
    comment: toPublicComment(updatedComment),
  });
}

/* =========================================================
  D. DELETE COMMENT
   ========================================================= */

export async function deleteComment(req: Request, res: Response): Promise<void> {
  const authUser = getAuthUser(req);
  const { commentId } = req.params;

  if (typeof commentId !== "string") {
    throw new AppError("Comment not found", 404);
  }

  await getCommentForModification(commentId, authUser.id);

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  res.status(200).json({
    message: "Comment deleted",
    commentId,
  });
}
