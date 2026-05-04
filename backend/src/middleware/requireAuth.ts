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

  const parts = authorizationHeader.split(" ");

  if (parts.length !== 2) {
    return null;
  }

  const [scheme, token] = parts;

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

// Protected route
export const requireAuth: RequestHandler = async (req, _res, next) => {
  const token = getBearerToken(req.get("Authorization"));

  if (!token) {
    throw new AppError("Authentication required require", 401);
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
