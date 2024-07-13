import { BarkContext } from "../bark-context";
import { DogOii, DogOiiSchema } from "../models/dog-oii";

export async function toDogOii(
  context: BarkContext,
  dogEncryptedOii: string,
): Promise<DogOii> {
  const { oiiEncryptionService } = context;
  const decrypted =
    await oiiEncryptionService.getDecryptedData(dogEncryptedOii);
  const decoded = JSON.parse(decrypted);
  const validated = DogOiiSchema.parse(decoded);
  return validated;
}
