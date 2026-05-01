import { Router } from "express";
import { prisma } from "../db/prisma.js";

export const healthRoutes = Router();

healthRoutes.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

healthRoutes.get("/db", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;

  res.status(200).json({
    database: "connected",
  });
});
