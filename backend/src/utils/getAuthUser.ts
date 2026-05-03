import type { Request } from "express";

import { AppError } from "./AppError.js";

export function getAuthUser(req: Request) {
  if (!req.user) {
    throw new AppError("Authorization required", 401);
  }

  return req.user;
}
