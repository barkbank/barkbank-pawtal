import { BarkContext } from "../bark-context";
import { AdminPii, AdminPiiSchema } from "../models/admin-models";

export async function toAdminPii(
  context: BarkContext,
  adminEncryptedPii: string,
): Promise<AdminPii> {
  const { piiEncryptionService } = context;
  const decrypted =
    await piiEncryptionService.getDecryptedData(adminEncryptedPii);
  const decoded = JSON.parse(decrypted);
  const validated = AdminPiiSchema.parse(decoded);
  return validated;
}
