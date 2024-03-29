import { MedicalStatus, ProfileStatus } from "../data/db-enums";

export type MyDog = {
  dogId: string;
  dogName: string;
  dogProfileStatus: ProfileStatus;
  dogMedicalStatus: MedicalStatus;
};

export type ListMyPetsResponse = {
  dogs: MyDog[];
};
