import { BarkContext } from "../bark-context";
import {
  EncryptedUserAccount,
  EncryptedUserAccountSchema,
  EncryptedUserAccountSpec,
  EncryptedUserAccountSpecSchema,
  UserAccount,
  UserAccountSchema,
  UserAccountSpec,
  UserAccountSpecSchema,
} from "../models/user-models";
import { UserPii, UserPiiSchema } from "../models/user-pii";

export async function toUserPii(
  context: BarkContext,
  userEncryptedPii: string,
): Promise<UserPii> {
  const { piiEncryptionService } = context;
  const encoded = await piiEncryptionService.getDecryptedData(userEncryptedPii);
  const decoded = JSON.parse(encoded);
  const validated = UserPiiSchema.strict().parse(decoded);
  return validated;
}

export async function toEncryptedUserPii(
  context: BarkContext,
  userPii: UserPii,
): Promise<string> {
  const { piiEncryptionService } = context;
  const validated = UserPiiSchema.strict().parse(userPii);
  const encoded = JSON.stringify(validated);
  const encrypted = await piiEncryptionService.getEncryptedData(encoded);
  return encrypted;
}

export async function toEncryptedUserAccount(
  context: BarkContext,
  userAccount: UserAccount,
): Promise<EncryptedUserAccount> {
  const validated = UserAccountSchema.strict().parse(userAccount);
  const { userEmail, userTitle, userName, userPhoneNumber, ...others } =
    validated;
  const userPii: UserPii = { userEmail, userTitle, userName, userPhoneNumber };
  const userEncryptedPii = await toEncryptedUserPii(context, userPii);
  const out: EncryptedUserAccount = { userEncryptedPii, ...others };
  return EncryptedUserAccountSchema.parse(out);
}

export async function toUserAccount(
  context: BarkContext,
  encrypted: EncryptedUserAccount,
): Promise<UserAccount> {
  const validated = EncryptedUserAccountSchema.strict().parse(encrypted);
  const { userEncryptedPii, ...others } = validated;
  const userPii = await toUserPii(context, userEncryptedPii);
  const out: UserAccount = { ...userPii, ...others };
  return UserAccountSchema.parse(out);
}

export async function toEncryptedUserAccountSpec(
  context: BarkContext,
  spec: UserAccountSpec,
): Promise<EncryptedUserAccountSpec> {
  const { emailHashService } = context;
  const validated = UserAccountSpecSchema.strict().parse(spec);
  const { userEmail, userTitle, userName, userPhoneNumber, ...others } =
    validated;
  const userPii: UserPii = { userEmail, userTitle, userName, userPhoneNumber };
  const userHashedEmail = await emailHashService.getHashHex(userEmail);
  const userEncryptedPii = await toEncryptedUserPii(context, userPii);
  const out: EncryptedUserAccountSpec = {
    userHashedEmail,
    userEncryptedPii,
    ...others,
  };
  return EncryptedUserAccountSpecSchema.parse(out);
}
