import type { Post, User } from "../generated/prisma/client.js";

import { toPublicUser, type PublicUser } from "./userMappers.js";

/* =========================================================
  A. POST WITH AUTHOR INPUT TYPE
   ========================================================= */

type PostWithAuthorAndCounts = Post & {
  author: User;
  _count: {
    likes: number;
    comments: number;
  };
};

/* =========================================================
  B. PUBLIC POST RESPONSE TYPE
   ========================================================= */

export type PublicPost = {
  id: string;
  content: string;
  author: PublicUser;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
};

/* =========================================================
  C. POST MAPPER
   ========================================================= */

export function toPublicPost(post: PostWithAuthorAndCounts): PublicPost {
  return {
    id: post.id,
    content: post.content,
    author: toPublicUser(post.author),
    likeCount: post._count.likes,
    commentCount: post._count.comments,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}
