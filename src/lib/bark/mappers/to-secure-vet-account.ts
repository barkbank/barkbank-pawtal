import { BarkContext } from "../bark-context";
import {
  SecureVetAccount,
  SecureVetAccountSchema,
  VetAccount,
} from "../models/vet-models";

export async function toSecureVetAccount(
  context: BarkContext,
  account: VetAccount,
): Promise<SecureVetAccount> {
  const { emailHashService, piiEncryptionService } = context;
  const { vetAccountEmail, vetAccountName, ...others } = account;
  const vetAccountHashedEmail =
    await emailHashService.getHashHex(vetAccountEmail);
  const vetAccountEncryptedEmail =
    await piiEncryptionService.getEncryptedData(vetAccountEmail);
  const vetAccountEncryptedName =
    await piiEncryptionService.getEncryptedData(vetAccountName);
  const out: SecureVetAccount = {
    ...others,
    vetAccountHashedEmail,
    vetAccountEncryptedEmail,
    vetAccountEncryptedName,
  };
  return SecureVetAccountSchema.parse(out);
}
