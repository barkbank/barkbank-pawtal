import { z } from "zod";

export const DOG_GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  UNKNOWN: "UNKNOWN",
} as const;

export const DogGenderSchema = z.nativeEnum(DOG_GENDER);

export type DogGender = z.infer<typeof DogGenderSchema>;

export const SpecifiedDogGenderSchema = z.enum([
  DOG_GENDER.MALE,
  DOG_GENDER.FEMALE,
]);

export type SpecifiedDogGender = z.infer<typeof SpecifiedDogGenderSchema>;
