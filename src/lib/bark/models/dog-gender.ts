import { z } from "zod";

export const DOG_GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  UNKNOWN: "UNKNOWN",
} as const;

export const DogGenderSchema = z.nativeEnum(DOG_GENDER);

export type DogGender = z.infer<typeof DogGenderSchema>;
