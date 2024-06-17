import { z } from "zod";

export const OwnerInfoSchema = z.object({
  ownerUserId: z.string(),
});

export type OwnerInfo = z.infer<typeof OwnerInfoSchema>;
