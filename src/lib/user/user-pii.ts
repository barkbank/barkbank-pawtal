import { EncryptionService } from "../services/encryption";

export type UserPii = {
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
};

export type DogOii = {
  dogName: string;
};

export async function encryptUserPii(
  pii: UserPii,
  encryptionService: EncryptionService,
): Promise<string> {
  const data = JSON.stringify(pii);
  const encryptedData = await encryptionService.getEncryptedData(data);
  return encryptedData;
}

export async function decryptUserPii(
  userEncryptedPii: string,
  encryptionService: EncryptionService,
): Promise<UserPii> {
  const decryptedData =
    await encryptionService.getDecryptedData(userEncryptedPii);
  const pii = JSON.parse(decryptedData) as UserPii;
  return pii;
}

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
