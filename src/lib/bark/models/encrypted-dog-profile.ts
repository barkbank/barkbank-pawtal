import { z } from "zod";
import { DogProfileSchema } from "./dog-profile";

export const EncryptedDogProfileSchema = DogProfileSchema.omit({
  dogName: true,
}).extend({
  dogEncryptedOii: z.string(),
});

export type EncryptedDogProfile = z.infer<typeof EncryptedDogProfileSchema>;
