import { BarkContext } from "../bark-context";
import { UserPii } from "../models/user-pii";

export async function toEncryptedUserPii(
  context: BarkContext,
  userPii: UserPii,
): Promise<string> {
  const { piiEncryptionService } = context;
  const jsonEncoded = JSON.stringify(userPii);
  const encryptedUserPii =
    await piiEncryptionService.getEncryptedData(jsonEncoded);
  return encryptedUserPii;
}
