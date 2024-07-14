import { z } from "zod";

export const KnownVetAccountSchema = z.object({
  vetAccountEmail: z.string().email(),
});

export type KnownVetAccount = z.infer<typeof KnownVetAccountSchema>;
