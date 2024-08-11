import { BarkContext } from "../bark-context";
import { EncryptedUserFields } from "../models/encrypted-user-fields";
import { toEncryptedUserPii } from "./user-mappers";
import { toUserPii } from "./user-mappers";

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
