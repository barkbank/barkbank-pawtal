import { UserResidency, UserResidencySchema } from "../enums/user-residency";
import { DogGender, DogGenderSchema } from "../enums/dog-gender";
import { DogAppointment, DogAppointmentSchema } from "./dog-appointment";
import { DogStatuses, DogStatusesSchema } from "./dog-statuses";
import { z } from "zod";

export const MyAccountSchema = z.object({
  userCreationTime: z.date(),
  userResidency: UserResidencySchema,
  userTitle: z.string().optional(),
  userName: z.string(),
  userEmail: z.string().email(),
  userPhoneNumber: z.string(),
});

export type MyAccount = z.infer<typeof MyAccountSchema>;

export const MyAccountDetailsUpdateSchema = z.object({
  userResidency: UserResidencySchema,
  userTitle: z.string().optional(),
  userName: z.string(),
  userPhoneNumber: z.string(),
});

export type MyAccountDetailsUpdate = z.infer<
  typeof MyAccountDetailsUpdateSchema
>;

export const MyLastContactedTimeSchema = z.object({
  userLastContactedTime: z.date().nullable(),
});

export type MyLastContactedTime = z.infer<typeof MyLastContactedTimeSchema>;

export const MyDogSchema = z.object({
  dogId: z.string(),
  dogName: z.string(),
  dogGender: DogGenderSchema,
  dogAppointments: z.array(DogAppointmentSchema),
  dogStatuses: DogStatusesSchema,
});

export type MyDog = z.infer<typeof MyDogSchema>;


/**
 * @deprecated Do not use yet, we will expand this to be a full report.
 */
export type MyDogReport = {
  reportId: string;
  visitTime: Date;
  vetId: string;
  vetName: string;
};
