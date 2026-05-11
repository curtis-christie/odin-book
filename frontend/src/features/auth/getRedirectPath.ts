type RedirectLocation = {
  state: unknown;
};

type RedirectState = {
  from?: unknown;
};

export function getRedirectPath(
  location: RedirectLocation,
  fallbackPath = "/feed",
): string {
  const state = location.state as RedirectState | null;

  if (typeof state?.from === "string" && state.from.startsWith("/")) {
    return state.from;
  }

  return fallbackPath;
}
