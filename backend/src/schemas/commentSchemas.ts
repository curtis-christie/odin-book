import * as z from "zod";

export const createCommentSchema = z.object({
  body: z
    .object({
      content: z
        .string()
        .trim()
        .min(1, "Comment content is required")
        .max(500, "Comment content must be 500 characters or less"),
    })
    .strict(),
});

export type CreateCommentInput = z.infer<
  typeof createCommentSchema
>["body"];
