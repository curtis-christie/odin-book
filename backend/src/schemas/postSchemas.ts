import { z } from "zod";

/* =========================================================
  A. CREATE POST SCHEMA
   ========================================================= */

export const createPostSchema = z.object({
  body: z
    .object({
      content: z
        .string()
        .trim()
        .min(1, "Post content is required")
        .max(1000, "Post content must be 1000 characters or less"),
    })
    .strict(),
});

/* =========================================================
  B. POST ID PARAMS SCHEMA
   ========================================================= */

export const postIdParamsSchema = z.object({
  params: z
    .object({
      postId: z.uuid("Post ID must be valid"),
    })
    .strict(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>["body"];
export type PostIdParams = z.infer<typeof postIdParamsSchema>["params"];
