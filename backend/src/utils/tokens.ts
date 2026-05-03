import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

import { env } from "../config/env.js";

export type AccessTokenPayload = {
  userId: string;
};

export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as StringValue,
  });
}
