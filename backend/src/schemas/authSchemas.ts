import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.email({ error: "Email must be valid" }).trim().toLowerCase(),

    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, { error: "Username must be at least 3 characters" })
      .max(30, { error: "Username must be at most 30 characters" })
      .regex(/^[a-z0-9_]+$/, {
        error: "Username can only contain lowercase letters, numbers, and underscores",
      }),

    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters" })
      .max(100, { error: "Password must be at most 100 characters" }),

    firstName: z
      .string()
      .trim()
      .min(1, { error: "First name is required" })
      .max(50, { error: "First name must be at most 50 characters" }),

    lastName: z
      .string()
      .trim()
      .min(1, { error: "Last name is required" })
      .max(50, { error: "Last name must be at most 50 characters" }),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
