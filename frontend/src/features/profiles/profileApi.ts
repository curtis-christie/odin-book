import { apiFetch } from "../../api/apiClient";
import type {
  PaginatedResponse,
  PublicPost,
  PublicUserWithRelationship,
} from "../../types/api";

export type ProfileResponse = {
  user: PublicUserWithRelationship;
};

export type UserPostsResponse = PaginatedResponse<"posts", PublicPost>;

export function getUserProfile(userId: string): Promise<ProfileResponse> {
  return apiFetch<ProfileResponse>(`/users/${userId}`);
}

export function getUserPosts(
  userId: string,
  page: number,
  limit = 10,
): Promise<UserPostsResponse> {
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return apiFetch<UserPostsResponse>(
    `/users/${userId}/posts?${searchParams.toString()}`,
  );
}
