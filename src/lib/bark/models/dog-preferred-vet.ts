import { z } from "zod";

export const DogPreferredVetSchema = z.object({
  dogId: z.string(),
  vetId: z.string(),
  vetEmail: z.string().email(),
  vetName: z.string(),
  vetPhoneNumber: z.string(),
  vetAddress: z.string(),
});

export type DogPreferredVet = z.infer<typeof DogPreferredVetSchema>;
