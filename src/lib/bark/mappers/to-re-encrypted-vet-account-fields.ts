import { BarkContext } from "../bark-context";
import { SecureVetAccount } from "../models/vet-models";
import { toSecureVetAccount } from "./to-secure-vet-account";
import { toVetAccount } from "./to-vet-account";

export async function toReEncryptedVetAccountFields(
  context: BarkContext,
  secureVetAccount: SecureVetAccount,
): Promise<SecureVetAccount> {
  const vetAccount = await toVetAccount(context, secureVetAccount);
  const reEncrypted = await toSecureVetAccount(context, vetAccount);
  return reEncrypted;
}
