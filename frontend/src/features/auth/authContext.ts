import { createContext } from "react";

import type { SafeUser } from "../../types/api";
import type { LoginInput, RegisterInput } from "./authApi";

export type AuthContextValue = {
  user: SafeUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  loadCurrentUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
