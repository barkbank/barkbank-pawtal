import { z } from "zod";

export const EncryptedAdminFieldsSchema = z.object({
  adminId: z.string(),
  adminEncryptedPii: z.string(),
});

export type EncryptedAdminFields = z.infer<typeof EncryptedAdminFieldsSchema>;
