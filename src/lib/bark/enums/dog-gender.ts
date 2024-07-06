import { z } from "zod";

// TODO: All dog gender is specified, since time of registration. Simplify to just DogGender.

export const DOG_GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
} as const;

export const DogGenderSchema = z.nativeEnum(DOG_GENDER);

export type DogGender = z.infer<typeof DogGenderSchema>;
