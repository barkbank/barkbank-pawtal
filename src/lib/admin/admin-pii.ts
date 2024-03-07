import { AdminPii } from "../data/db-models";
import { EncryptionService } from "../services/encryption";

export async function encryptAdminPii(
  pii: AdminPii,
  encryptionService: EncryptionService,
): Promise<string> {
  const data = JSON.stringify(pii);
  const encryptedData = await encryptionService.getEncryptedData(data);
  return encryptedData;
}

export async function decryptAdminPii(
  adminEncryptedPii: string,
  encryptionService: EncryptionService,
): Promise<AdminPii> {
  const decryptedData =
    await encryptionService.getDecryptedData(adminEncryptedPii);
  const pii = JSON.parse(decryptedData) as AdminPii;
  return pii;
}
