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

export type UserPii = {
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
};

export type UserSpec = {
  userHashedEmail: string;
  userEncryptedPii: string;
};

export type UserGen = {
  userId: string;
  userCreationTime: Date;
  userModificationTime: Date;
};

export type User = UserSpec & UserGen;

export enum YesNoUnknown {
  YES = "YES",
  NO = "NO",
  UNKNOWN = "UNKNOWN",
}

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

export type DogOii = {
  dogName: string;
};

export type DogSpec = {
  dogStatus: DogStatus;
  dogEncryptedOii: string;
  dogBreed: string;
  dogBirthday: string;
  dogGender: DogGender;
  /**
   * Weight of the dog. It should either be a positive integer or null.
   */
  dogWeightKg: number | null;
  dogDea1Point1: DogAntigenPresence;
  dogEverPregnant: YesNoUnknown;
  dogEverReceivedTransfusion: YesNoUnknown;
};

export type DogGen = {
  dogId: string;
  dogCreationTime: Date;
  dogModificationTime: Date;
};

export type Dog = { userId: string } & DogSpec & DogGen;

export type AdminPii = {
  adminName: string;
  adminEmail: string;
  adminPhoneNumber: string;
};

export type AdminSecurePii = {
  adminHashedEmail: string;
  adminEncryptedPii: string;
};

export type AdminPermissions = {
  adminCanManageAdminAccounts: boolean;
  adminCanManageVetAccounts: boolean;
  adminCanManageUserAccounts: boolean;
  adminCanManageDonors: boolean;
};

export const NO_ADMIN_PERMISSIONS: AdminPermissions = {
  adminCanManageAdminAccounts: false,
  adminCanManageVetAccounts: false,
  adminCanManageUserAccounts: false,
  adminCanManageDonors: false,
};

export type AdminSpec = AdminSecurePii & AdminPermissions;

export type AdminGen = {
  adminId: string;
  adminCreationTime: Date;
  adminModificationTime: Date;
};

export type Admin = AdminSecurePii & AdminPermissions & AdminGen;

export type VetSpec = {
  vetEmail: string;
  vetName: string;
  vetPhoneNumber: string;
  vetAddress: string;
};

export type VetGen = {
  vetId: string;
  vetCreationTime: Date;
  vetModificationTime: Date;
};

export type Vet = VetSpec & VetGen;
