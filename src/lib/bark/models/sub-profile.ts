import { z } from "zod";
import { DogProfileSchema } from "./dog-profile";

/**
 * The subset of DogProfile that can be modified after the first medical
 * report.
 */
export const SubProfileSchema = DogProfileSchema.omit({
  dogBreed: true,
  dogBirthday: true,
  dogGender: true,
  dogDea1Point1: true,
});

export type SubProfile = z.infer<typeof SubProfileSchema>;
