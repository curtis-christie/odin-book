import type { RequestHandler } from "express";
import * as z from "zod";

import { AppError } from "../utils/AppError.js";

function formatIssuePath(path: PropertyKey[]) {
  return path.map(String).join(".");
}

function formatValidationMessage(error: z.ZodError) {
  return error.issues
    .map((issue) => {
      const path = formatIssuePath(issue.path);

      if (!path) {
        return issue.message;
      }

      return `${path}: ${issue.message}`;
    })
    .join(", ");
}

export function validateRequest(schema: z.ZodType): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      next(new AppError(formatValidationMessage(result.error), 400));
      return;
    }

    next();
  };
}
