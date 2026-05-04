import type { Request, Response } from "express";

import { prisma } from "../db/prisma.js";
import type {
  CreatePostInput,
  UpdatePostInput,
} from "../schemas/postSchemas.js";
import { AppError } from "../utils/AppError.js";
import { getAuthUser } from "../utils/getAuthUser.js";
import { toPublicPost } from "../utils/postMappers.js";

/* =========================================================
  A. SHARED POST INCLUDE
   ========================================================= */

const postInclude = {
  author: true,
  _count: {
    select: {
      likes: true,
      comments: true,
    },
  },
} as const;

/* =========================================================
  B. CREATE POST
   ========================================================= */

export async function createPost(
  req: Request,
  res: Response,
): Promise<void> {
  const authUser = getAuthUser(req);
  const input = req.body as CreatePostInput;

  const post = await prisma.post.create({
    data: {
      content: input.content,
      authorId: authUser.id,
    },
    include: postInclude,
  });

  res.status(201).json({
    post: toPublicPost(post),
  });
}

/* =========================================================
  C. GET FEED POSTS
   ========================================================= */

export async function getFeedPosts(
  req: Request,
  res: Response,
): Promise<void> {
  const authUser = getAuthUser(req);

  const posts = await prisma.post.findMany({
    where: {
      authorId: authUser.id,
    },
    include: postInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json({
    posts: posts.map(toPublicPost),
  });
}

/* =========================================================
  D. GET POST BY ID
   ========================================================= */

export async function getPostById(
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
    include: postInclude,
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  res.json({
    post: toPublicPost(post),
  });
}

/* =========================================================
  E. UPDATE POST
   ========================================================= */

export async function updatePost(
  req: Request,
  res: Response,
): Promise<void> {
  const authUser = getAuthUser(req);
  const { postId } = req.params;
  const { content } = req.body as UpdatePostInput;

  if (typeof postId !== "string") {
    throw new AppError("Post not found", 404);
  }

  const existingPost = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (!existingPost) {
    throw new AppError("Post not found", 404);
  }

  if (existingPost.authorId !== authUser.id) {
    throw new AppError("You are not allowed to modify this post", 403);
  }

  const updatedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      content,
    },
    include: postInclude,
  });

  res.status(200).json({
    post: toPublicPost(updatedPost),
  });
}

/* =========================================================
  F. DELETE POST BY ID
   ========================================================= */

export async function deletePost(
  req: Request,
  res: Response,
): Promise<void> {
  const authUser = getAuthUser(req);
  const { postId } = req.params;

  if (typeof postId !== "string") {
    throw new AppError("Post not found", 404);
  }

  const existingPost = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (!existingPost) {
    throw new AppError("Post not found", 404);
  }

  if (existingPost.authorId !== authUser.id) {
    throw new AppError("You are not allowed to modify this post", 403);
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  res.status(200).json({
    message: "Post deleted",
    postId,
  });
}
