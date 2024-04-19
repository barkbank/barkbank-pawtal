import {
  DogAntigenPresence,
  MedicalStatus,
  ParticipationStatus,
  ProfileStatus,
  ServiceStatus,
  YesNoUnknown,
  DogGender,
} from "../data/db-enums";
import { StatusSet } from "../data/status-mapper";

export type MyAccount = {
  userCreationTime: Date;
  userName: string;
  userResidency: string;
  userEmail: string;
  userPhoneNumber: string;
};

export type MyLastContactedTime = {
  userLastContactedTime: Date | null;
};

export type MyDogAppointment = {
  callId: string;
  vetId: string;
  vetName: string;
};

export type MyDog = {
  dogId: string;
  dogName: string;
  dogGender: DogGender;
  dogProfileStatus: ProfileStatus;
  dogMedicalStatus: MedicalStatus;
  dogServiceStatus: ServiceStatus;
  dogParticipationStatus: ParticipationStatus;
  dogAppointments: MyDogAppointment[];
};

export type MyDogReport = {
  reportId: string;
  visitTime: Date;
  vetId: string;
  vetName: string;
};

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
 * The dog fields that can be updated prior to the first medical report. This
 * can be used by registration and add-dog.
 */
export type MyDogRegistration = {
  dogName: string;
  dogBreed: string;
  dogBirthday: Date;
  dogGender: DogGender;
  dogWeightKg: number | null;
  dogDea1Point1: DogAntigenPresence;
  dogEverPregnant: YesNoUnknown;
  dogEverReceivedTransfusion: YesNoUnknown;
  dogPreferredVetId: string | null;
};

// WIP: Remove MyDogRegistrationUpdate. Use MyDogRegistration instead.
export type MyDogRegistrationUpdate = {
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
};

export type MyDogDetailsUpdate = {
  dogId: string;
  dogName: string;
  dogWeightKg: number | null;
  dogEverPregnant: YesNoUnknown;
  dogEverReceivedTransfusion: YesNoUnknown;
  dogPreferredVetId: string | null;
  dogParticipationStatus: ParticipationStatus;
  dogNonParticipationReason: string;
  dogPauseExpiryTime: Date | null;
};
