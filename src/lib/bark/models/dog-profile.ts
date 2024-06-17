import { z } from "zod";
import { DogAntigenPresenceSchema } from "../enums/dog-antigen-presence";
import { SpecifiedDogGenderSchema } from "../enums/dog-gender";
import { YesNoUnknownSchema } from "../enums/yes-no-unknown";

/**
 * The dog fields that can be updated prior to the first medical report. This
 * can be used by registration and add-dog.
 */

export const DogProfileSchema = z.object({
  dogName: z.string(),
  dogBreed: z.string(),
  dogBirthday: z.date(),
  dogGender: SpecifiedDogGenderSchema,
  dogWeightKg: z.number().nullable(),
  dogDea1Point1: DogAntigenPresenceSchema,
  dogEverPregnant: YesNoUnknownSchema,
  dogEverReceivedTransfusion: YesNoUnknownSchema,
  dogPreferredVetId: z.string(),
});

export type DogProfile = z.infer<typeof DogProfileSchema>;
