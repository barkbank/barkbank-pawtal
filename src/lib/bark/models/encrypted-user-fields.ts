import { z } from "zod";

export const EncryptedUserFieldsSchema = z.object({
  userId: z.string(),
  userEncryptedPii: z.string(),
});

export type EncryptedUserFields = z.infer<typeof EncryptedUserFieldsSchema>;
