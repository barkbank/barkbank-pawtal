import { BarkContext } from "../bark-context";
import {
  SecureVetAccount,
  VetAccount,
  VetAccountSchema,
} from "../models/vet-models";

export async function toVetAccount(
  context: BarkContext,
  secured: SecureVetAccount,
): Promise<VetAccount> {
  const { piiEncryptionService } = context;
  const {
    vetAccountHashedEmail,
    vetAccountEncryptedEmail,
    vetAccountEncryptedName,
    ...others
  } = secured;

  const [vetAccountEmail, vetAccountName] = await Promise.all([
    piiEncryptionService.getDecryptedData(vetAccountEncryptedEmail),
    piiEncryptionService.getDecryptedData(vetAccountEncryptedName),
  ]);

  const out: VetAccount = {
    ...others,
    vetAccountEmail,
    vetAccountName,
  };
  return VetAccountSchema.parse(out);
}
