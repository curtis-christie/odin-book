import type { Request, Response } from "express";

import { prisma } from "../db/prisma.js";
import type { CreatePostInput } from "../schemas/postSchemas.js";
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

export async function createPost(req: Request, res: Response) {
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

export async function getFeedPosts(req: Request, res: Response) {
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

export async function getPostById(req: Request, res: Response) {
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
