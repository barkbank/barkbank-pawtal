import { BarkContext } from "../bark-context";
import {
  AdminAccount,
  AdminAccountSchema,
  AdminPiiSchema,
  EncryptedAdminAccount,
  EncryptedAdminAccountSchema,
} from "../models/admin-models";
import { toAdminPii } from "./to-admin-pii";
import { toEncryptedAdminPii } from "./to-encrypted-admin-pii";

export async function toEncryptedAdminAccount(
  context: BarkContext,
  adminAccount: AdminAccount,
): Promise<EncryptedAdminAccount> {
  const { emailHashService } = context;
  const { adminEmail } = adminAccount;
  const adminEncryptedPii = await toEncryptedAdminPii(
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
