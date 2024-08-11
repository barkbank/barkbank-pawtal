import { BarkContext } from "../bark-context";
import {
  EncryptedUserAccount,
  EncryptedUserAccountSchema,
  UserAccount,
  UserAccountSchema,
} from "../models/user-models";
import { UserPii, UserPiiSchema } from "../models/user-pii";

export async function toUserPii(
  context: BarkContext,
  userEncryptedPii: string,
): Promise<UserPii> {
  const { piiEncryptionService } = context;
  const encoded = await piiEncryptionService.getDecryptedData(userEncryptedPii);
  const decoded = JSON.parse(encoded);
  const validated = UserPiiSchema.parse(decoded);
  return validated;
}

export async function toEncryptedUserPii(
  context: BarkContext,
  userPii: UserPii,
): Promise<string> {
  const { piiEncryptionService } = context;
  const validated = UserPiiSchema.parse(userPii);
  const encoded = JSON.stringify(validated);
  const encrypted = await piiEncryptionService.getEncryptedData(encoded);
  return encrypted;
}

export async function toEncryptedUserAccount(
  context: BarkContext,
  userAccount: UserAccount,
): Promise<EncryptedUserAccount> {
  const { userEmail, userTitle, userName, userPhoneNumber, ...others } =
    userAccount;
  const userPii: UserPii = { userEmail, userTitle, userName, userPhoneNumber };
  const userEncryptedPii = await toEncryptedUserPii(context, userPii);
  const out: EncryptedUserAccount = { userEncryptedPii, ...others };
  return EncryptedUserAccountSchema.parse(out);
}

export async function toUserAccount(
  context: BarkContext,
  encrypted: EncryptedUserAccount,
): Promise<UserAccount> {
  const { userEncryptedPii, ...others } = encrypted;
  const userPii = await toUserPii(context, userEncryptedPii);
  const out: UserAccount = { ...userPii, ...others };
  return UserAccountSchema.parse(out);
}
