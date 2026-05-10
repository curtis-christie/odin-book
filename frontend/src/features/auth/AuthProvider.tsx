import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getStoredAuthToken,
  removeStoredAuthToken,
  storeAuthToken,
} from "../../api/apiClient";
import type { ApiError } from "../../api/apiClient";
import type { SafeUser } from "../../types/api";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  type LoginInput,
  type RegisterInput,
} from "./authApi";
import { AuthContext } from "./authContext.ts";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    getStoredAuthToken(),
  );
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState(() =>
    Boolean(getStoredAuthToken()),
  );

  const logout = useCallback((): void => {
    removeStoredAuthToken();
    setAccessToken(null);
    setUser(null);
    setIsLoading(false);
  }, []);

  const loadCurrentUser = useCallback(async (): Promise<void> => {
    const token = getStoredAuthToken();

    if (!token) {
      logout();
      return;
    }

    setIsLoading(true);

    try {
      const response = await getCurrentUser();

      setAccessToken(token);
      setUser(response.user);
    } catch (error) {
      const apiError = error as ApiError;

      if (apiError.status === 401) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  const login = useCallback(async (input: LoginInput): Promise<void> => {
    const response = await loginUser(input);

    storeAuthToken(response.accessToken);
    setAccessToken(response.accessToken);
    setUser(response.user);
    setIsLoading(false);
  }, []);

  const register = useCallback(
    async (input: RegisterInput): Promise<void> => {
      const response = await registerUser(input);

      storeAuthToken(response.accessToken);
      setAccessToken(response.accessToken);
      setUser(response.user);
      setIsLoading(false);
    },
    [],
  );

  useEffect(() => {
    const token = getStoredAuthToken();

    if (!token) {
      return;
    }

    let isActive = true;

    async function bootstrapCurrentUser(): Promise<void> {
      try {
        const response = await getCurrentUser();

        if (!isActive) {
          return;
        }

        setAccessToken(token);
        setUser(response.user);
      } catch (error) {
        if (!isActive) {
          return;
        }

        const apiError = error as ApiError;

        if (apiError.status === 401) {
          removeStoredAuthToken();
          setAccessToken(null);
          setUser(null);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void bootstrapCurrentUser();

    return () => {
      isActive = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(user && accessToken),
      isLoading,
      login,
      register,
      logout,
      loadCurrentUser,
    }),
    [
      user,
      accessToken,
      isLoading,
      login,
      register,
      logout,
      loadCurrentUser,
    ],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
