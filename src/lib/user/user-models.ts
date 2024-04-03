import {
  DogAntigenPresence,
  DogGender,
  MedicalStatus,
  ParticipationStatus,
  ProfileStatus,
  ServiceStatus,
  YesNoUnknown,
} from "../data/db-enums";
import { StatusSet } from "../data/status-mapper";

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

  dogReports: MyDogReport[];
};

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
  // TODO: dogPauseEndReason: string; When the schema supports it
  dogPauseExpiryTime: Date | null;
};
