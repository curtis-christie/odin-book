const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AUTH_TOKEN_STORAGE_KEY = "odinbook-token";

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export type ApiError = {
  status: number;
  message: string;
  errors?: {
    path: string;
    message: string;
  }[];
};

export function getStoredAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function storeAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export function removeStoredAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

function getApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not configured");
  }

  return API_BASE_URL;
}

export async function apiFetch<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const token = getStoredAuthToken();

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      ...(options.body !== undefined
        ? { "Content-Type": "application/json" }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body:
      options.body !== undefined
        ? JSON.stringify(options.body)
        : undefined,
  });

  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    throw createApiError(response, responseBody);
  }

  return responseBody as TResponse;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

function createApiError(
  response: Response,
  responseBody: unknown,
): ApiError {
  if (isApiErrorBody(responseBody)) {
    return {
      status: response.status,
      message: responseBody.message,
      ...(responseBody.errors ? { errors: responseBody.errors } : {}),
    };
  }

  return {
    status: response.status,
    message: "Request failed",
  };
}

function isApiErrorBody(value: unknown): value is {
  message: string;
  errors?: {
    path: string;
    message: string;
  }[];
} {
  if (!value || typeof value !== "object") {
    return false;
  }

  return "message" in value && typeof value.message === "string";
}
