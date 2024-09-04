import { z } from "zod";
import { DogAntigenPresenceSchema } from "../enums/dog-antigen-presence";
import { DogGenderSchema } from "../enums/dog-gender";
import { YesNoUnknownSchema } from "../enums/yes-no-unknown";

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

export const EncryptedDogProfileSchema = DogProfileSchema.omit({
  dogName: true,
}).extend({
  dogEncryptedOii: z.string(),
});

export const DogIdentifierSchema = z.object({
  dogId: z.string(),
});

export type DogProfile = z.infer<typeof DogProfileSchema>;
export type DogIdentifier = z.infer<typeof DogIdentifierSchema>;
export type EncryptedDogProfile = z.infer<typeof EncryptedDogProfileSchema>;
