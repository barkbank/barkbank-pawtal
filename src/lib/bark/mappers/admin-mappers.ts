import { BarkContext } from "../bark-context";
import {
  AdminAccount,
  AdminAccountSchema,
  AdminPii,
  AdminPiiSchema,
  EncryptedAdminAccount,
  EncryptedAdminAccountSchema,
} from "../models/admin-models";

export async function toEncryptedAdminAccount(
  context: BarkContext,
  adminAccount: AdminAccount,
): Promise<EncryptedAdminAccount> {
  const { emailHashService } = context;
  const { adminEmail } = adminAccount;
  const adminEncryptedPii = await toAdminEncryptedPii(
    context,
    AdminPiiSchema.parse(adminAccount),
  );
  const adminHashedEmail = await emailHashService.getHashHex(adminEmail);
  const out = { adminEncryptedPii, adminHashedEmail, ...adminAccount };
  return EncryptedAdminAccountSchema.parse(out);
}

export async function toAdminAccount(
  context: BarkContext,
  encryptedAdminAccount: EncryptedAdminAccount,
): Promise<AdminAccount> {
  const { adminEncryptedPii } = encryptedAdminAccount;
  const adminPii = await toAdminPii(context, adminEncryptedPii);
  const out = { ...adminPii, ...encryptedAdminAccount };
  return AdminAccountSchema.parse(out);
}

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

export function toAdminEncryptedPii(
  context: BarkContext,
  adminPii: AdminPii,
): Promise<string> {
  const { piiEncryptionService } = context;
  const validated = AdminPiiSchema.parse(adminPii);
  const encoded = JSON.stringify(validated);
  const encrypted = piiEncryptionService.getEncryptedData(encoded);
  return encrypted;
}
