import { BarkContext } from "../bark-context";
import { EncryptedUserFields } from "../models/encrypted-user-fields";
import { toEncryptedUserPii } from "./to-encrypted-user-pii";
import { toUserPii } from "./to-user-pii";

export async function toReEncryptedUserFields(
  context: BarkContext,
  encryptedUserFields: EncryptedUserFields,
): Promise<EncryptedUserFields> {
  const { userId, userEncryptedPii } = encryptedUserFields;
  const userPii = await toUserPii(context, userEncryptedPii);
  const reEncryptedUserPii = await toEncryptedUserPii(context, userPii);
  const out: EncryptedUserFields = {
    userId,
    userEncryptedPii: reEncryptedUserPii,
  };
  return out;
}
