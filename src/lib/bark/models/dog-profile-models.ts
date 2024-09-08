import { z } from "zod";
import { DogAntigenPresenceSchema } from "../enums/dog-antigen-presence";
import { DogGenderSchema } from "../enums/dog-gender";
import { YesNoUnknownSchema } from "../enums/yes-no-unknown";
import { YesNoSchema } from "../enums/yes-no";

export const EncryptedDogSchema = z.object({
  dogId: z.string(),
  userId: z.string(),
  dogEncryptedOii: z.string(),
  dogBreed: z.string(),
  dogBirthday: z.date(),
  dogGender: DogGenderSchema,
  dogWeightKg: z.number().nullable(),
  dogDea1Point1: DogAntigenPresenceSchema,
  dogEverPregnant: YesNoUnknownSchema,
  dogEverReceivedTransfusion: YesNoUnknownSchema,
});

export const EncryptedDogSpecSchema = EncryptedDogSchema.omit({ dogId: true });

export const VetPreferenceSchema = z.object({
  userId: z.string(),
  dogId: z.string(),
  vetId: z.string(),
});

/**
 * The dog fields that can be updated prior to the first medical report. This
 * can be used by registration and add-dog.
 */
export const DogProfileSpecSchema = z.object({
  dogName: z.string(),
  dogBreed: z.string(),
  dogBirthday: z.date(),
  dogGender: DogGenderSchema,
  dogWeightKg: z.number().nullable(),
  dogDea1Point1: DogAntigenPresenceSchema,
  dogEverPregnant: YesNoUnknownSchema,
  dogEverReceivedTransfusion: YesNoUnknownSchema,
  dogPreferredVetId: z.string(),
});

/**
 * The subset of DogProfile that can be modified after the first medical report.
 *
 * Note the following:
 *
 * -(a) Commented out fields are omitted.
 *
 * -(b) dogEverPregnant and dogEverReceivedTransfusion are YesNoSchema.
 *
 * -(c) dogWeightKg cannot be null.
 */
export const SubProfileSchema = z.object({
  dogName: z.string(),
  // dogBreed: z.string(),
  // dogBirthday: z.date(),
  // dogGender: SpecifiedDogGenderSchema,
  dogWeightKg: z.number(),
  // dogDea1Point1: DogAntigenPresenceSchema,
  dogEverPregnant: YesNoSchema,
  dogEverReceivedTransfusion: YesNoSchema,
  dogPreferredVetId: z.string(),
});

export type EncryptedDog = z.infer<typeof EncryptedDogSchema>;
export type EncryptedDogSpec = z.infer<typeof EncryptedDogSpecSchema>;
export type VetPreference = z.infer<typeof VetPreferenceSchema>;
export type DogProfileSpec = z.infer<typeof DogProfileSpecSchema>;
export type SubProfile = z.infer<typeof SubProfileSchema>;
