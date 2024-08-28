import { BarkContext } from "../bark-context";
import { AdminPii, AdminPiiSchema } from "../models/admin-models";

export function toEncryptedAdminPii(
  context: BarkContext,
  adminPii: AdminPii,
): Promise<string> {
  const { piiEncryptionService } = context;
  const validated = AdminPiiSchema.parse(adminPii);
  const encoded = JSON.stringify(validated);
  const encrypted = piiEncryptionService.getEncryptedData(encoded);
  return encrypted;
}
