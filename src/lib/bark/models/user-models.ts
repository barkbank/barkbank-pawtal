import { UserResidency, UserResidencySchema } from "../enums/user-residency";
import { DogGender } from "../enums/dog-gender";
import { DogAppointment } from "./dog-appointment";
import { DogStatuses } from "./dog-statuses";
import { z } from "zod";

export const MyAccountSchema = z.object({
  userCreationTime: z.date(),
  userTitle: z.string().optional(),
  userName: z.string(),
  userResidency: UserResidencySchema,
  userEmail: z.string().email(),
  userPhoneNumber: z.string(),
});

export type MyAccount = z.infer<typeof MyAccountSchema>;

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
