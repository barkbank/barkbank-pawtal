import { BarkContext } from "../bark-context";
import { EncryptedAdminFields } from "../models/encrypted-admin-fields";
import { toAdminPii } from "./to-admin-pii";
import { toEncryptedAdminPii } from "./to-encrypted-admin-pii";

export async function toReEncryptedAdminFields(
  context: BarkContext,
  fields: EncryptedAdminFields,
): Promise<EncryptedAdminFields> {
  const { adminId, adminEncryptedPii } = fields;
  const pii = await toAdminPii(context, adminEncryptedPii);
  const reEncrypted = await toEncryptedAdminPii(context, pii);
  const out: EncryptedAdminFields = {
    adminId,
    adminEncryptedPii: reEncrypted,
  };
  return out;
}
