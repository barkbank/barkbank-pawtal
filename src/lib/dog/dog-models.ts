import {
  DogAntigenPresence,
  DogGender,
  MedicalStatus,
  ParticipationStatus,
  ProfileStatus,
  ServiceStatus,
  YesNoUnknown,
} from "../data/db-enums";

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