export function getErrorMessage(
  error: unknown,
  fallbackMessage = "Something went wrong.",
): string {
  if (!error || typeof error !== "object") {
    return fallbackMessage;
  }

  if ("message" in error && typeof error.message === "string") {
    return error.message;
  }

  return fallbackMessage;
}
