import { MedicalStatus, ProfileStatus } from "../data/db-enums";

export type MyAppointment = {
  vetId: string;
  vetName: string;
};

export type MyDog = {
  dogId: string;
  dogName: string;
  dogProfileStatus: ProfileStatus;
  dogMedicalStatus: MedicalStatus;
  appointment: MyAppointment | null;
};

export type ListMyPetsResponse = {
  dogs: MyDog[];
};
