import {
  DogGender,
  MedicalStatus,
  ProfileStatus,
  ServiceStatus,
} from "../data/db-enums";

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
