import { z } from "zod";
import { DogGenderSchema } from "./dog-gender";

/**
 * Encrypted version of DogIdInfo
 */

export const EncryptedDogIdInfoSchema = z.object({
  dogEncryptedOii: z.string(),
  dogGender: DogGenderSchema,
  dogBreed: z.string(),
  userEncryptedPii: z.string(),
});

export type EncryptedDogIdInfo = z.infer<typeof EncryptedDogIdInfoSchema>;
