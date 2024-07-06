import { z } from "zod";

export const DOG_GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
} as const;

export const DogGenderSchema = z.nativeEnum(DOG_GENDER);

export type DogGender = z.infer<typeof DogGenderSchema>;
