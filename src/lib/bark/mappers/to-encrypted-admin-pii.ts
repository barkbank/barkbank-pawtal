import { BarkContext } from "../bark-context";
import { AdminPii } from "../models/admin-pii";

export function toEncryptedAdminPii(
  context: BarkContext,
  adminPii: AdminPii,
): Promise<string> {
  const { piiEncryptionService } = context;
  const encoded = JSON.stringify(adminPii);
  const encrypted = piiEncryptionService.getEncryptedData(encoded);
  return encrypted;
}
