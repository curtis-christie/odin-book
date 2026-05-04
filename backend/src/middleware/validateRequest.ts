import type { NextFunction, Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import * as z from "zod";

/* =========================================================
  A. REQUEST SCHEMA TYPE
  ========================================================= */

type RequestValidationSchema = z.ZodType<{
  body?: unknown;
  params?: unknown;
  query?: unknown;
}>;

/* =========================================================
  B. FORMAT ISSUE PATH
  ========================================================= */

function formatIssuePath(path: PropertyKey[]) {
  return path.map(String).join(".");
}

/* =========================================================
  C. VALIDATE REQUEST
  ========================================================= */

export function validateRequest(schema: RequestValidationSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        path: formatIssuePath(issue.path),
        message: issue.message,
      }));

      res.status(400).json({
        message: "Validation failed",
        errors,
      });

      return;
    }

    req.body = result.data.body ?? req.body;

    if (result.data.params) {
      req.params = result.data.params as ParamsDictionary;
    }

    next();
  };
}
