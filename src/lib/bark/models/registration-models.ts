import { z } from "zod";
import { UserResidencySchema } from "../enums/user-residency";
import { DogGenderSchema } from "../enums/dog-gender";
import { DogAntigenPresenceSchema } from "../enums/dog-antigen-presence";
import { YesNoUnknownSchema } from "../enums/yes-no-unknown";

export const RegistrationRequestSchema = z.object({
  emailOtp: z.string(),
  userTitle: z.string().optional(),
  userName: z.string(),
  userEmail: z.string(),
  userPhoneNumber: z.string(),
  userResidency: UserResidencySchema,
  dogName: z.string(),
  dogBreed: z.string(),
  dogBirthday: z.date(),
  dogGender: DogGenderSchema,
  dogWeightKg: z.number().nullable(),
  dogDea1Point1: DogAntigenPresenceSchema,
  dogEverPregnant: YesNoUnknownSchema,
  dogEverReceivedTransfusion: YesNoUnknownSchema,
  dogPreferredVetId: z.string().optional(),
});

export type RegistrationRequest = z.infer<typeof RegistrationRequestSchema>;
