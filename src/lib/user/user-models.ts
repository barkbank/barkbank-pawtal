import { UserResidency } from "../bark/enums/user-residency";
import { DogGender } from "../bark/enums/dog-gender";
import { DogAppointment } from "../bark/models/dog-appointment";
import { DogStatuses } from "../bark/models/dog-statuses";

// WIP: Define MyAccountSchema
export type MyAccount = {
  userCreationTime: Date;
  // WIP: Add userTitle
  userName: string;
  userResidency: UserResidency;
  userEmail: string;
  userPhoneNumber: string;
};

export type MyLastContactedTime = {
  userLastContactedTime: Date | null;
};

// WIP: Define MyAccountDetailsUpdateSchema
export type MyAccountDetailsUpdate = {
  // WIP: Add userTitle
  userName: string;
  userPhoneNumber: string;
  userResidency: UserResidency;
};

/**
 * Summary details of a user's dog for the My Pets view.
 */
export type MyDog = {
  dogId: string;
  dogName: string;
  dogGender: DogGender;
  dogAppointments: DogAppointment[];
  dogStatuses: DogStatuses;
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
