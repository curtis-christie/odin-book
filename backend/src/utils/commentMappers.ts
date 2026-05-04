import type { Comment, User } from "../generated/prisma/client.js";

import { toPublicUser, type PublicUser } from "./userMappers.js";

type CommentWithAuthor = Comment & {
  author: User;
};

export type PublicComment = {
  id: string;
  content: string;
  author: PublicUser;
  postId: string;
  createdAt: Date;
  updatedAt: Date;
};

export function toPublicComment(
  comment: CommentWithAuthor,
): PublicComment {
  return {
    id: comment.id,
    content: comment.content,
    author: toPublicUser(comment.author),
    postId: comment.postId,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
}
