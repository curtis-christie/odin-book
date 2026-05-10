import { apiFetch } from "../../api/apiClient";
import type { AuthResponse, SafeUser } from "../../types/api";

export type LoginInput = {
  identifier: string;
  password: string;
};

export type RegisterInput = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function loginUser(input: LoginInput): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: input,
  });
}

export function registerUser(input: RegisterInput): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: input,
  });
}

export function getCurrentUser(): Promise<{ user: SafeUser }> {
  return apiFetch<{ user: SafeUser }>("/auth/me");
}
