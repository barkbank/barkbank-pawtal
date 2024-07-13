import { BarkContext } from "../bark-context";
import { UserPii, UserPiiSchema } from "../models/user-pii";

export async function toUserPii(
  context: BarkContext,
  userEncryptedPii: string,
): Promise<UserPii> {
  const { piiEncryptionService } = context;
  const jsonEncoded =
    await piiEncryptionService.getDecryptedData(userEncryptedPii);
  return UserPiiSchema.parse(JSON.parse(jsonEncoded));
}
