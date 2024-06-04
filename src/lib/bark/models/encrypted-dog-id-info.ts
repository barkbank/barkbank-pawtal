import { z } from "zod";
import { DogIdInfoSchema } from "./dog-id-info";

/**
 * Encrypted version of DogIdInfo
 */

export const EncryptedDogIdInfoSchema = DogIdInfoSchema.omit({
  dogName: true,
  ownerName: true,
}).extend({
  dogEncryptedOii: z.string(),
  userEncryptedPii: z.string(),
});

export type EncryptedDogIdInfo = z.infer<typeof EncryptedDogIdInfoSchema>;
