import {
  DogAntigenPresence,
  DogGender,
  MedicalStatus,
  ParticipationStatus,
  ProfileStatus,
  ServiceStatus,
  YesNoUnknown,
} from "../data/db-enums";
import { HighlightedStatus, StatusSet } from "../data/status-mapper";

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

export type MyAccount = {
  userId: string;
  userCreationTime: Date;
  userName: string;
  userResidency: string;
  userEmail: string;
  userPhoneNumber: string;
};

export type MyLastContactedTime = {
  userId: string;
  userLastContactedTime: Date | null;
};
