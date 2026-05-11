import { apiFetch } from "../../api/apiClient";
import type {
  PaginatedResponse,
  PublicUserWithRelationship,
} from "../../types/api";

export type UsersResponse = PaginatedResponse<
  "users",
  PublicUserWithRelationship
>;

export function getUsers(
  page: number,
  limit = 10,
): Promise<UsersResponse> {
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return apiFetch<UsersResponse>(`/users?${searchParams.toString()}`);
}

export function sendFollowRequest(receiverId: string): Promise<void> {
  return apiFetch<void>(`/follow-requests/${receiverId}`, {
    method: "POST",
  });
}

export function unfollowUser(userId: string): Promise<void> {
  return apiFetch<void>(`/follows/${userId}`, {
    method: "DELETE",
  });
}
