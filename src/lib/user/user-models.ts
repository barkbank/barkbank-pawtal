import { DogAntigenPresence, DogGender, YesNoUnknown } from "../data/db-models";
import { EncryptionService } from "../services/encryption";

export type UserPii = {
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
};

export type DogOii = {
  dogName: string;
};

/**
 * Models the details about dogs that we collect from the registration form.
 */
export type DogRegistration = {
  dogName: string;
  dogBreed: string;
  dogBirthday: string;
  dogGender: DogGender;
  dogWeightKg: number | null;
  dogDea1Point1: DogAntigenPresence;
  dogEverPregnant: YesNoUnknown;
  dogEverReceivedTransfusion: YesNoUnknown;
  dogPreferredVetIdList: string[];
};

/**
 * Models the details about ths user that we collect from the registration form.
 */
export type UserRegistration = {
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
};

/**
 * Models the details about the user and their dogs that we collect from the
 * registration form.
 */
export type Registration = {
  user: UserRegistration;
  dogList: DogRegistration[];
};

// WIP: No one should use this.
export async function encryptUserPii(
  pii: UserPii,
  encryptionService: EncryptionService,
): Promise<string> {
  const data = JSON.stringify(pii);
  const encryptedData = await encryptionService.getEncryptedData(data);
  return encryptedData;
}

// WIP: No one should use this.
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
