import { z } from "zod";
import { DogProfileSpecSchema } from "./dog-profile-models";

export const EncryptedDogProfileSchema = DogProfileSpecSchema.omit({
  dogName: true,
}).extend({
  dogEncryptedOii: z.string(),
});

// TODO: We should be able to remove this when DogProfileService is done.
export type EncryptedDogProfile = z.infer<typeof EncryptedDogProfileSchema>;
