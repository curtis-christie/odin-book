import type { RequestHandler } from "express";
import bcrypt from "bcrypt";

import { prisma } from "../db/prisma.js";
import { AppError } from "../utils/AppError.js";
import { toSafeUser } from "../utils/userMappers.js";
import type { LoginInput, RegisterInput } from "../schemas/authSchemas.js";
import { signAccessToken } from "../utils/tokens.js";
import { getAuthUser } from "../utils/getAuthUser.js";

const SALT_ROUNDS = 10;

export const register: RequestHandler = async (req, res) => {
  const { email, username, password, firstName, lastName } =
    req.body as RegisterInput;

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

  const accessToken = signAccessToken({
    userId: user.id,
  });

  res.status(201).json({
    user: toSafeUser(user),
    accessToken,
  });
};

export const login: RequestHandler = async (req, res) => {
  const { identifier, password } = req.body as LoginInput;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const passwordIsValid = await bcrypt.compare(
    password,
    user.passwordHash,
  );

  if (!passwordIsValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const accessToken = signAccessToken({
    userId: user.id,
  });

  res.status(200).json({
    user: toSafeUser(user),
    accessToken,
  });
};

export const getMe: RequestHandler = (req, res) => {
  const user = getAuthUser(req);

  res.json({ user });
};
