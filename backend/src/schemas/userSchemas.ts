import { z } from "zod";

export const updateCurrentUserSchema = z.object({
  body: z
    .object({
      firstName: z
        .string()
        .trim()
        .min(1, "First name is required")
        .max(50, "First name must be 50 characters or less")
        .optional(),

      lastName: z
        .string()
        .trim()
        .min(1, "Last name is required")
        .max(50, "Last name must be 50 characters or less")
        .optional(),

      bio: z
        .string()
        .trim()
        .max(160, "Bio must be 160 characters or less")
        .nullable()
        .optional(),

      profileImageUrl: z
        .string()
        .trim()
        .pipe(z.url({ error: "Profile image URL must be valid" }))
        .nullable()
        .optional(),
    })
    .strict()
    .refine((body) => Object.keys(body).length > 0, {
      message: "At least one field is required",
    }),
});

export type UpdateCurrentUserInput = z.infer<
  typeof updateCurrentUserSchema
>["body"];
