import { UserResidency, UserResidencySchema } from "../enums/user-residency";
import { DogGender } from "../enums/dog-gender";
import { DogAppointment } from "./dog-appointment";
import { DogStatuses } from "./dog-statuses";
import { z } from "zod";

export const MyAccountSchema = z.object({
  userCreationTime: z.date(),
  userResidency: UserResidencySchema,
  userTitle: z.string().optional(),
  userName: z.string(),
  userEmail: z.string().email(),
  userPhoneNumber: z.string(),
});

export const MyAccountDetailsUpdateSchema = z.object({
  userResidency: UserResidencySchema,
  userTitle: z.string().optional(),
  userName: z.string(),
  userPhoneNumber: z.string(),
});

export const MyLastContactedTimeSchema = z.object({
  userLastContactedTime: z.date().nullable(),
});

export type MyAccount = z.infer<typeof MyAccountSchema>;

export type MyAccountDetailsUpdate = z.infer<
  typeof MyAccountDetailsUpdateSchema
>;

export type MyLastContactedTime = z.infer<typeof MyLastContactedTimeSchema>;

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
