import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

import { env } from "../config/env.js";
import { AppError } from "./AppError.js";

export type AccessTokenPayload = {
  userId: string;
};

export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as StringValue,
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = jwt.verify(token, env.jwtExpiresIn);

  if (
    typeof payload !== "object" ||
    payload === null ||
    typeof payload.userId !== "string"
  ) {
    throw new AppError("Authentication required", 401);
  }

  return {
    userId: payload.userId,
  };
}
