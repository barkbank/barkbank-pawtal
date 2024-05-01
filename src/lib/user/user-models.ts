import {
  MedicalStatus,
  ParticipationStatus,
  ProfileStatus,
  ServiceStatus,
  DogGender,
  UserResidency,
} from "../data/db-enums";

export type MyAccount = {
  userCreationTime: Date;
  userName: string;
  userResidency: UserResidency;
  userEmail: string;
  userPhoneNumber: string;
};

export type MyLastContactedTime = {
  userLastContactedTime: Date | null;
};

export type MyAccountDetailsUpdate = {
  userName: string;
  userPhoneNumber: string;
  userResidency: UserResidency;
};

export type MyDogAppointment = {
  callId: string;
  vetId: string;
  vetName: string;
};

/**
 * Summary details of a user's dog for the My Pets view.
 */
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

/**
 * @deprecated Do not use yet, we will expand this to be a full report.
 */
export type MyDogReport = {
  reportId: string;
  visitTime: Date;
  vetId: string;
  vetName: string;
};
