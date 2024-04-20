import {
  DogAntigenPresence,
  MedicalStatus,
  ParticipationStatus,
  ProfileStatus,
  ServiceStatus,
  YesNoUnknown,
  DogGender,
  UserResidency,
} from "../data/db-enums";
import { StatusSet } from "../data/status-mapper";

export type MyAccount = {
  userCreationTime: Date;
  userName: string;
  userResidency: UserResidency;
  userEmail: string;
  userPhoneNumber: string;
};

export type MyLastContactedTime = {
  userLastContactedTime: Date | null;
};

export type MyAccountDetailsUpdate = {
  userName: string;
  userPhoneNumber: string;
  userResidency: UserResidency;
};

export type MyDogAppointment = {
  callId: string;
  vetId: string;
  vetName: string;
};

/**
 * Summary details of a user's dog for the My Pets view.
 */
export type MyDog = {
  dogId: string;
  dogName: string;
  dogGender: DogGender;
  dogProfileStatus: ProfileStatus;
  dogMedicalStatus: MedicalStatus;
  dogServiceStatus: ServiceStatus;
  dogParticipationStatus: ParticipationStatus;
  dogAppointments: MyDogAppointment[];
  // WIP: is this more like pending reports? pendingReports: PendingReport[]
  // WIP: PendingReport = {callId, vetId, vetName}
};

/**
 * @deprecated Do not use yet, we will expand this to be a full report.
 */
export type MyDogReport = {
  reportId: string;
  visitTime: Date;
  vetId: string;
  vetName: string;
};

// WIP: Refactor the following...

// WIP: DONE: Transform getMyDogDetails into getDogProfile

// WIP: Rename MyDogAppointment to PendingReport
// WIP: Rename MyDog::dogAppointments to pendingReports

/**
 * @deprecated Use DogProfile & DogStatuses instead.
 */
export type MyDogDetails = StatusSet & {
  dogId: string;

  dogName: string;
  dogBreed: string;
  dogBirthday: Date;
  dogGender: DogGender;
  dogWeightKg: number | null;
  dogDea1Point1: DogAntigenPresence;
  dogEverPregnant: YesNoUnknown;
  dogEverReceivedTransfusion: YesNoUnknown;
  dogPreferredVetId: string | null;
  dogParticipationStatus: ParticipationStatus;
  dogNonParticipationReason: string;
  dogPauseExpiryTime: Date | null;

  dogReports: MyDogReport[];
};

/**
 * The different statuses of a dog.
 */
export type DogStatuses = {
  dogServiceStatus: ServiceStatus;
  dogProfileStatus: ProfileStatus;
  dogMedicalStatus: MedicalStatus;
  dogParticipationStatus: ParticipationStatus;
  numPendingReports: number;
};

/**
 * The dog fields that can be updated prior to the first medical report. This
 * can be used by registration and add-dog.
 */
export type DogProfile = {
  dogName: string;
  dogBreed: string;
  dogBirthday: Date;
  dogGender: DogGender;
  dogWeightKg: number | null;
  dogDea1Point1: DogAntigenPresence;
  dogEverPregnant: YesNoUnknown;
  dogEverReceivedTransfusion: YesNoUnknown;
  dogPreferredVetId: string;
};

export type SecureDogProfile = {
  dogEncryptedOii: string;
  dogBreed: string;
  dogBirthday: Date;
  dogGender: DogGender;
  dogWeightKg: number | null;
  dogDea1Point1: DogAntigenPresence;
  dogEverPregnant: YesNoUnknown;
  dogEverReceivedTransfusion: YesNoUnknown;
  dogPreferredVetId: string;
};

/**
 * The subset of MyDogProfile that can be modified after the first medical
 * report.
 */
export type SubProfile = {
  dogName: string;
  dogWeightKg: number | null;
  dogEverPregnant: YesNoUnknown;
  dogEverReceivedTransfusion: YesNoUnknown;
  dogPreferredVetId: string;
};
