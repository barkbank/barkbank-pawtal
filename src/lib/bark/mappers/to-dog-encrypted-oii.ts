import { BarkContext } from "../bark-context";
import { DogOii } from "../models/dog-oii";

export async function toDogEncryptedOii(
  context: BarkContext,
  dogOii: DogOii,
): Promise<string> {
  const { oiiEncryptionService } = context;
  const encoded = JSON.stringify(dogOii);
  const encrypted = await oiiEncryptionService.getEncryptedData(encoded);
  return encrypted;
}
