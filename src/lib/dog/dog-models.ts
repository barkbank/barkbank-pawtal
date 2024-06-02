import {
  DogAntigenPresence,
  MedicalStatus,
  ParticipationStatus,
  ProfileStatus,
  ServiceStatus,
  YesNoUnknown,
} from "../data/db-enums";
import { DogGender } from "../bark/models/dog-gender";

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

/**
 * An appointment
 */
export type DogAppointment = {
  dogId: string;
  callId: string;
  vetId: string;
  vetName: string;
};

export type DogPreferredVet = {
  dogId: string;
  vetId: string;
  vetEmail: string;
  vetName: string;
  vetPhoneNumber: string;
  vetAddress: string;
};
