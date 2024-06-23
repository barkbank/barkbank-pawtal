import { z } from "zod";
import { YesNoSchema } from "../enums/yes-no";

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

export type SubProfile = z.infer<typeof SubProfileSchema>;
