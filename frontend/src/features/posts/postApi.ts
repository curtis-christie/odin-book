import { apiFetch } from "../../api/apiClient";
import type { PaginationMeta, PublicPost } from "../../types/api";

export type FeedPostsResponse = {
  posts: PublicPost[];
  pagination: PaginationMeta;
};

export type CreatePostResponse = {
  post: PublicPost;
};

export type GetFeedPostsInput = {
  page: number;
  limit: number;
};

export type CreatePostInput = {
  content: string;
};

export function getFeedPosts({
  page,
  limit,
}: GetFeedPostsInput): Promise<FeedPostsResponse> {
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return apiFetch<FeedPostsResponse>(
    `/posts/feed?${searchParams.toString()}`,
  );
}

export function createPost(
  input: CreatePostInput,
): Promise<CreatePostResponse> {
  return apiFetch<CreatePostResponse>("/posts", {
    method: "POST",
    body: input,
  });
}
