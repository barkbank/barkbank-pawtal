import {
  DogAntigenPresence,
  DogGender,
  MedicalStatus,
  ProfileStatus,
  ServiceStatus,
  YesNoUnknown,
} from "../data/db-enums";
import { HighlightedStatus } from "../data/status-mapper";

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

export type MyDogDetails = {
  dogId: string;
  dogName: string;
  dogBreed: string;
  dogBirthday: Date;
  dogGender: DogGender;
  dogWeight: number | null;
  dogDea1Point1: DogAntigenPresence;
  dogEverPregnant: YesNoUnknown;
  dogEverReceivedTransfusion: YesNoUnknown;
  dogHighlightedStatus: HighlightedStatus;
};
