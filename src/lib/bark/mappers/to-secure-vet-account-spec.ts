import { BarkContext } from "../bark-context";
import {
  SecureVetAccountSpec,
  SecureVetAccountSpecSchema, VetAccountSpec
} from "../models/vet-models";

export async function toSecureVetAccountSpec(
  context: BarkContext,
  account: VetAccountSpec,
): Promise<SecureVetAccountSpec> {
  const { emailHashService, piiEncryptionService } = context;
  const { vetAccountEmail, vetAccountName, ...others } = account;

  const [
    vetAccountHashedEmail,
    vetAccountEncryptedEmail,
    vetAccountEncryptedName,
  ] = await Promise.all([
    emailHashService.getHashHex(vetAccountEmail),
    piiEncryptionService.getEncryptedData(vetAccountEmail),
    piiEncryptionService.getEncryptedData(vetAccountName),
  ]);

  const out: SecureVetAccountSpec = {
    ...others,
    vetAccountHashedEmail,
    vetAccountEncryptedEmail,
    vetAccountEncryptedName,
  };
  return SecureVetAccountSpecSchema.parse(out);
}
