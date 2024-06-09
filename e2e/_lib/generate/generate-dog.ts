import dogBreedsJson from "@/resources/dog_breeds.json";
import { pickOne } from "./gen-utils";
import { FEMALE_DOG_NAMES, MALE_DOG_NAMES } from "./name-lists";
import { generateRandomGUID } from "@/lib/utilities/bark-guid";
import { getTestBirthday } from "../e2e-test-utils";
import { sprintf } from "sprintf-js";
import { z } from "zod";

export const GenerateDogSchema = z.object({
  dogName: z.string(),
  dogBreed: z.string(),
  dogGender: z.enum(["MALE", "FEMALE"]),
  dogBirthday: z.string(),
  dogWeightKg: z.string(),
  ageYears: z.number(),
});

export type GenerateDogType = z.infer<typeof GenerateDogSchema>;

export function generateDog(options?: {
  dogGender?: "MALE" | "FEMALE";
}): GenerateDogType {
  const dogGender =
    options?.dogGender ?? pickOne<"MALE" | "FEMALE">(["FEMALE", "MALE"]);
  const nameList = dogGender === "MALE" ? MALE_DOG_NAMES : FEMALE_DOG_NAMES;
  const guid = generateRandomGUID(4);
  const dogName = `${pickOne(nameList)} (${guid})`;
  const dogBreeds = dogBreedsJson.dog_breeds.map((entry) => entry.dog_breed);
  const dogBreed = pickOne(dogBreeds);
  const ageYears = pickOne([3, 4, 5, 6]);
  const dogBirthday = getTestBirthday(ageYears);
  const dogWeightKg = sprintf("%.1f", 20 + Math.random() * 20);
  const result: GenerateDogType = {
    dogName,
    dogBreed,
    dogGender,
    dogBirthday,
    dogWeightKg,
    ageYears,
  };
  console.log("Generated Dog", result);
  return GenerateDogSchema.parse(result);
}
