// This module defines data types.
//
// Terminology
//
// - SomeSpec: This refers to the record that gets inserted into the DB to make
//   a record. If PII is involved, this would contain secured PII.
//
// - SomeGen: This refers to fields whose values become known after creation of
//   record.
//
// - SomeRecord: This is a full database record. (For Vet it is just Vet since
//   there is no PII.)
//
// - Some: This sould be a full record with PII.
//

export type UserPii = {
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
};

export type UserSecurePii = {
  userHashedEmail: string;
  userEncryptedPii: string;
};

// https://dev.to/ivanzm123/dont-use-enums-in-typescript-they-are-very-dangerous-57bh
export const UserResidencies = {
  OTHER: "OTHER",
  SINGAPORE: "SINGAPORE",
} as const;
export type UserResidency =
  (typeof UserResidencies)[keyof typeof UserResidencies];

export type UserDetails = {
  userResidency: UserResidency;
};

export type UserSpec = UserSecurePii & UserDetails;

export type UserGen = {
  userId: string;
  userCreationTime: Date;
  userModificationTime: Date;
};

export type UserRecord = UserSpec & UserGen;

export type User = UserPii & UserDetails & UserGen;

// TODO: Do not use enum - https://dev.to/ivanzm123/dont-use-enums-in-typescript-they-are-very-dangerous-57bh
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

// TODO: Remove DogStatus
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

export type DogSecureOii = {
  dogEncryptedOii: string;
};

export type DogDetails = {
  // TODO: Remove dogStatus
  dogStatus: DogStatus;
  dogBreed: string;
  dogBirthday: Date;
  dogGender: DogGender;
  /**
   * Weight of the dog. It should either be a positive integer or null.
   */
  dogWeightKg: number | null;
  dogDea1Point1: DogAntigenPresence;
  dogEverPregnant: YesNoUnknown;
  dogEverReceivedTransfusion: YesNoUnknown;
};

export type DogSpec = DogSecureOii & DogDetails;

export type DogGen = {
  dogId: string;
  dogCreationTime: Date;
  dogModificationTime: Date;
};

export type DogOwner = {
  userId: string;
};

export type DogRecord = DogOwner & DogSecureOii & DogDetails & DogGen;

export type Dog = DogOwner & DogOii & DogDetails & DogGen;

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

export type AdminRecord = AdminSecurePii & AdminPermissions & AdminGen;

export type Admin = AdminPii & AdminPermissions & AdminGen;

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
