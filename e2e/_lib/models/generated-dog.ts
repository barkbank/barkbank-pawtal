import { z } from "zod";

export const GeneratedDogSchema = z.object({
  dogName: z.string(),
  dogBreed: z.string(),
  dogGender: z.enum(["MALE", "FEMALE"]),
  dogBirthday: z.string(),
  dogWeightKg: z.string(),
  ageYears: z.number(),
});

export type GeneratedDog = z.infer<typeof GeneratedDogSchema>;
