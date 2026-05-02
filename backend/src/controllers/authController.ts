import type { RequestHandler } from "express";
import bcrypt from "bcrypt";

import { prisma } from "../db/prisma.js";
import { AppError } from "../utils/AppError.js";
import { toSafeUser } from "../utils/userMappers.js";
import type { RegisterInput } from "../schemas/authSchemas.js";

const SALT_ROUNDS = 10;

export const register: RequestHandler = async (req, res) => {
  const { email, username, password, firstName, lastName } = req.body as RegisterInput;

  const existingEmailUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingEmailUser) {
    throw new AppError("Email is already in use", 409);
  }

  const existingUsernameUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUsernameUser) {
    throw new AppError("Username is already in use", 409);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      firstName,
      lastName,
    },
  });

  res.status(201).json({
    user: toSafeUser(user),
  });
};
