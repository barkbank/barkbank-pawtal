import { DogOii } from "../data/db-models";
import { EncryptionService } from "../services/encryption";

export async function encryptDogOii(
  oii: DogOii,
  encryptionService: EncryptionService,
): Promise<string> {
  const data = JSON.stringify(oii);
  const encryptedData = await encryptionService.getEncryptedData(data);
  return encryptedData;
}

export async function decryptDogOii(
  dogEncryptedOii: string,
  encryptionService: EncryptionService,
): Promise<DogOii> {
  const decryptedData =
    await encryptionService.getDecryptedData(dogEncryptedOii);
  const oii = JSON.parse(decryptedData) as DogOii;
  return oii;
}
