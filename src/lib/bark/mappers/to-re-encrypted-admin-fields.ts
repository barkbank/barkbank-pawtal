import { BarkContext } from "../bark-context";
import { EncryptedAdminFields } from "../models/encrypted-admin-fields";
import { toAdminPii, toAdminEncryptedPii } from "./admin-mappers";

export async function toReEncryptedAdminFields(
  context: BarkContext,
  fields: EncryptedAdminFields,
): Promise<EncryptedAdminFields> {
  const { adminId, adminEncryptedPii } = fields;
  const pii = await toAdminPii(context, adminEncryptedPii);
  const reEncrypted = await toAdminEncryptedPii(context, pii);
  const out: EncryptedAdminFields = {
    adminId,
    adminEncryptedPii: reEncrypted,
  };
  return out;
}
