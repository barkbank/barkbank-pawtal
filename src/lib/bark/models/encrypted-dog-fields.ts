import { z } from "zod";

export const EncryptedDogFieldsSchema = z.object({
  dogId: z.string(),
  dogEncryptedOii: z.string(),
});

export type EncryptedDogFields = z.infer<typeof EncryptedDogFieldsSchema>;
