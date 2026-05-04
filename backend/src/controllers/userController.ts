import type { Request, Response } from "express";

import { prisma } from "../db/prisma.js";
import type { UpdateCurrentUserInput } from "../schemas/userSchemas.js";
import { AppError } from "../utils/AppError.js";
import { getAuthUser } from "../utils/getAuthUser.js";
import { toPublicUser, toSafeUser } from "../utils/userMappers.js";

/* =========================================================
  A. GET ALL USERS
   ========================================================= */

export async function getUsers(req: Request, res: Response) {
  const authUser = getAuthUser(req);

  const users = await prisma.user.findMany({
    where: {
      id: {
        not: authUser.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json({
    users: users.map(toPublicUser),
  });
}

/* =========================================================
  B. GET USER BY ID
   ========================================================= */

export async function getUserById(req: Request, res: Response) {
  const { userId } = req.params;

  if (typeof userId !== "string") {
    throw new AppError("User not found", 404);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json({
    user: toPublicUser(user),
  });
}

/* =========================================================
  C. UPDATE CURRENT USER
   ========================================================= */

export async function updateCurrentUser(req: Request, res: Response) {
  const authUser = getAuthUser(req);
  const input = req.body as UpdateCurrentUserInput;

  const updatedUser = await prisma.user.update({
    where: {
      id: authUser.id,
    },
    data: input,
  });

  res.json({
    user: toSafeUser(updatedUser),
  });
}
