import { apiFetch } from "../../api/apiClient";
import type { SafeUser } from "../../types/api";

export type UpdateCurrentUserInput = {
  firstName?: string;
  lastName?: string;
  bio?: string | null;
  profileImageUrl?: string | null;
};

export type UpdateCurrentUserResponse = {
  user: SafeUser;
};

export function updateCurrentUser(
  input: UpdateCurrentUserInput,
): Promise<UpdateCurrentUserResponse> {
  return apiFetch<UpdateCurrentUserResponse>("/users/me", {
    method: "PATCH",
    body: input,
  });
}
