import { z } from "zod";

export const KnownVetSchema = z.object({
  vetEmail: z.string(),
  vetName: z.string(),
  vetPhoneNumber: z.string(),
  vetAddress: z.string(),
});

export type KnownVet = z.infer<typeof KnownVetSchema>;
