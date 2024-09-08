import { z } from "zod";
import { DogProfileSchema } from "./dog-profile-models";

export const EncryptedDogProfileSchema = DogProfileSchema.omit({
  dogName: true,
}).extend({
  dogEncryptedOii: z.string(),
});

// TODO: We should be able to remove this when DogProfileService is done.
export type EncryptedDogProfile = z.infer<typeof EncryptedDogProfileSchema>;
