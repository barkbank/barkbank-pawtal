import { z } from "zod";
import { YesNoSchema } from "../enums/yes-no";

/**
 * The subset of DogProfile that can be modified after the first medical report.
 *
 * Note the following:
 *
 * -(a) Commented out fields are omitted.
 *
 * -(b) The schema for ever pregnant and ever received transfusion is
 * YesNoSchema, not YesNoUnknown. This is because sub profiles are used only
 * after a dog has a report.
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
