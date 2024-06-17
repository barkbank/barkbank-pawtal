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

import { DogAntigenPresence } from "./db-enums";
import { YesNoUnknown } from "../bark/enums/yes-no-unknown";
import { DogGender } from "../bark/enums/dog-gender";
import { UserResidency } from "./db-enums";
import { ReportedIneligibility } from "./db-enums";
import { PosNegNil } from "../bark/enums/pos-neg-nil";
import { CallOutcome } from "../bark/enums/call-outcome";

export type UserPii = {
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
};

export type UserSecurePii = {
  userHashedEmail: string;
  userEncryptedPii: string;
};

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

export type DogOii = {
  dogName: string;
};

export type DogSecureOii = {
  dogEncryptedOii: string;
};

export type DogDetails = {
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

export type DbCallSpec = {
  vetId: string;
  dogId: string;
  callOutcome: CallOutcome;
  encryptedOptOutReason: string;
};

export type DbCallGen = {
  callId: string;
  callCreationTime: Date;
};

export type DbCall = DbCallSpec & DbCallGen;

export type DbReportSpec = {
  callId: string;
  visitTime: Date;
  dogWeightKg: number;
  dogBodyConditioningScore: number;
  dogDidDonateBlood: boolean;
  dogHeartworm: PosNegNil;
  dogDea1Point1: PosNegNil;
  dogReportedIneligibility: ReportedIneligibility;
  encryptedIneligibilityReason: string;
  ineligibilityExpiryTime: Date | null;
};

export type DbReportGen = {
  reportId: string;
  dogId: string;
  vetId: string;
  reportCreationTime: Date;
  reportModificationTime: Date;
};

export type DbReport = DbReportSpec & DbReportGen;
