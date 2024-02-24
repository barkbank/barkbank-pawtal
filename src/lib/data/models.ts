// This module defines data types.
//
// Terminology
//
// - SomeSpec: This refers to the set of data fields for Some type.
//
// - SomeGen: This refers to fields whose values become known after creation of
//   record.
//
// - Some: This is the combination of SomeSpec & SomeGen, and if there are foreign keys,
//   also those foreign keys. (See Dog, for example).
//

export type UserSpec = {
  userHashedEmail: string;
  userEncryptedPii: string;
};

export type UserGen = {
  userId: string;
  userCreationTime: Date;
};

export type User = UserSpec & UserGen;

export enum DogGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  UNKNOWN = "UNKNOWN",
}

export enum DogAntigenPresence {
  POSITIVE = "POSITIVE",
  NEGATIVE = "NEGATIVE",
  UNKNOWN = "UNKNOWN",
}

export enum DogStatus {
  NEW_PROFILE = "NEW_PROFILE",
  AVAILABLE_FOR_SCHEDULING = "AVAILABLE_FOR_SCHEDULING",
  AVAILABLE_FOR_DONATION = "AVAILABLE_FOR_DONATION",
  SCHEDULED_BY_VET = "SCHEDULED_BY_VET",
  AGE_COOLDOWN = "AGE_COOLDOWN",
  DONATION_COOLDOWN = "DONATION_COOLDOWN",
  MEDICAL_COOLDOWN = "MEDICAL_COOLDOWN",
  PERMANENTLY_INELIGIBLE = "PERMANENTLY_INELIGIBLE",
}

export type DogSpec = {
  dogStatus: DogStatus;
  dogEncryptedOii: string;
  dogBreed: string;
  dogBirthMonth: string;
  dogGender: DogGender;
  dogDea1Point1: DogAntigenPresence;
};

export type DogGen = {
  dogId: string;
  dogCreationTime: Date;
};

export type Dog = { userId: string } & DogSpec & DogGen;

export type AdminSpec = {
  adminHashedEmail: string;
  adminEncryptedPii: string;
};

export type AdminGen = {
  adminId: string;
  adminCreationTime: Date;
};

export type Admin = AdminSpec & AdminGen;

export type VetSpec = {
  vetEmail: string;
  vetName: string;
  vetPhoneNumber: string;
  vetAddress: string;
};

export type VetGen = {
  vetId: string;
  vetCreationTime: Date;
};

export type Vet = VetSpec & VetGen;
