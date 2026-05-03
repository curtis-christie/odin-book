import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { prisma } from "../db/prisma.js";
import { AppError } from "../utils/AppError.js";
import { toSafeUser } from "../utils/userMappers.js";
import { verifyAccessToken } from "../utils/tokens.js";

function getBearerToken(authorizationHeader: string | undefined) {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token, extra] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token || extra) {
    return null;
  }

  return token;
}

export const requireAuth: RequestHandler = async (req, _res, next) => {
  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    throw new AppError("Authentication required", 401);
  }

  try {
    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    if (!user) {
      throw new AppError("Authentication required", 401);
    }

    req.user = toSafeUser(user);
    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("Authentication required", 401);
    }

    throw error;
  }
};
