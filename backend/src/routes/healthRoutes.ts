import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { z } from "zod";
import { validateRequest } from "../middleware/validateRequest.js";

export const healthRoutes = Router();

const testValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { error: "Name is required" }),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

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

healthRoutes.post("/validation-test", validateRequest(testValidationSchema), (req, res) => {
  res.status(200).json({
    message: `Hello, ${req.body.name}`,
  });
});
