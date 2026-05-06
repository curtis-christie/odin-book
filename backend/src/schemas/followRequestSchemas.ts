import * as z from "zod";

export const receiverIdParamsSchema = z.object({
  params: z
    .object({
      receiverId: z.uuid("Receiver ID must be valid"),
    })
    .strict(),
});

export type ReceiverIdParams = z.infer<typeof receiverIdParamsSchema>["params"];

export const requestIdParamsSchema = z.object({
  params: z
    .object({
      requestId: z.uuid("Follow request ID must be valid"),
    })
    .strict(),
});

export type RequestIdParams = z.infer<typeof requestIdParamsSchema>["params"];
