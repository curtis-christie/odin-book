import * as z from "zod";

export const followUserIdParamsSchema = z.object({
  params: z
    .object({
      userId: z.uuid("User ID must be valid"),
    })
    .strict(),
});

export type FollowUserIdParams = z.infer<
  typeof followUserIdParamsSchema
>["params"];
