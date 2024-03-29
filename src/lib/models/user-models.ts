import { MedicalStatus, ProfileStatus } from "../data/db-enums";

export type MyDogAppointment = {
  callId: string;
  vetId: string;
  vetName: string;
};

export type MyDog = {
  dogId: string;
  dogName: string;
  dogProfileStatus: ProfileStatus;
  dogMedicalStatus: MedicalStatus;
  dogAppointments: MyDogAppointment[];
};

export type ListMyPetsResponse = {
  dogs: MyDog[];
};
