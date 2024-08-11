import { UserResidencySchema } from "../enums/user-residency";
import { DogGenderSchema } from "../enums/dog-gender";
import { DogAppointmentSchema } from "./dog-appointment";
import { DogStatusesSchema } from "./dog-statuses";
import { z } from "zod";
import { UserTitleSchema } from "../enums/user-title";

export const UserIdentifierSchema = z.object({
  userId: z.string(),
});

export const UserAccountSchema = z.object({
  userId: z.string(),
  userResidency: UserResidencySchema,
  userTitle: UserTitleSchema.optional(),
  userName: z.string(),
  userEmail: z.string().email(),
  userPhoneNumber: z.string(),
  userCreationTime: z.date(),
});

export const UserAccountSpecSchema = z.object({
  userEmail: z.string().email(),
  userTitle: UserTitleSchema.optional(),
  userName: z.string(),
  userPhoneNumber: z.string(),
  userResidency: UserResidencySchema,
});

export const UserAccountUpdateSchema = z.object({
  userResidency: UserResidencySchema,
  userTitle: UserTitleSchema.optional(),
  userName: z.string(),
  userPhoneNumber: z.string(),
});

export const EncryptedUserAccountSchema = z.object({
  userId: z.string(),
  userResidency: UserResidencySchema,
  userEncryptedPii: z.string(),
  userCreationTime: z.date(),
});

export const EncryptedUserAccountSpecSchema = z.object({
  userHashedEmail: z.string(),
  userEncryptedPii: z.string(),
  userResidency: UserResidencySchema,
});

export const MyLastContactedTimeSchema = z.object({
  userLastContactedTime: z.date().nullable(),
});

export const MyDogSchema = z.object({
  dogId: z.string(),
  dogName: z.string(),
  dogGender: DogGenderSchema,
  dogAppointments: z.array(DogAppointmentSchema),
  dogStatuses: DogStatusesSchema,
});

export type UserIdentifier = z.infer<typeof UserIdentifierSchema>;
export type UserAccount = z.infer<typeof UserAccountSchema>;
export type UserAccountSpec = z.infer<typeof UserAccountSpecSchema>;
export type UserAccountUpdate = z.infer<typeof UserAccountUpdateSchema>;
export type EncryptedUserAccount = z.infer<typeof EncryptedUserAccountSchema>;
export type EncryptedUserAccountSpec = z.infer<
  typeof EncryptedUserAccountSpecSchema
>;
export type MyLastContactedTime = z.infer<typeof MyLastContactedTimeSchema>;
export type MyDog = z.infer<typeof MyDogSchema>;
