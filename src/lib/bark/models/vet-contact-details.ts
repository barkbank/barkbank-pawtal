import { z } from "zod";

export const VetContactDetailsSchema = z.object({
  vetName: z.string(),
  vetPhoneNumber: z.string(),
  vetAddress: z.string(),
});

export type VetContactDetails = z.infer<typeof VetContactDetailsSchema>;
