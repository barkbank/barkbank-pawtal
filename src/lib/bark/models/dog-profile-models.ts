import { z } from "zod";
import { DogAntigenPresenceSchema } from "../enums/dog-antigen-presence";
import { DogGenderSchema } from "../enums/dog-gender";
import { YesNoUnknownSchema } from "../enums/yes-no-unknown";
import { YesNoSchema } from "../enums/yes-no";

/**
 * The dog fields that can be updated prior to the first medical report. This
 * can be used by registration and add-dog.
 */
export const DogProfileSchema = z.object({
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

export type DogProfile = z.infer<typeof DogProfileSchema>;
export type SubProfile = z.infer<typeof SubProfileSchema>;
