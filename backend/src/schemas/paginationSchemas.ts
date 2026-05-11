import * as z from "zod";

export const paginationQueryParamsSchema = z
  .object({
    page: z.coerce
      .number()
      .int("Page must be a whole number")
      .min(1, "Page must be at least 1")
      .default(1),
    limit: z.coerce
      .number()
      .int("Limit must be a whole number")
      .min(1, "Limit must be at least 1")
      .max(50, "Limit must be 50 or less")
      .default(10),
  })
  .strict();

export const paginationQuerySchema = z.object({
  query: paginationQueryParamsSchema,
});

export type PaginationQuery = z.infer<typeof paginationQueryParamsSchema>;
