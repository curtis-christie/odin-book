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

export const commentIdParamsSchema = z.object({
  params: z
    .object({
      commentId: z.uuid("Comment ID must be valid"),
    })
    .strict(),
});

export const updateCommentSchema = z.object({
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

export type UpdateCommentInput = z.infer<typeof updateCommentSchema>["body"];
export type CreateCommentInput = z.infer<typeof createCommentSchema>["body"];
