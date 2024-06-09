import dogBreedsJson from "@/resources/dog_breeds.json";
import { pickOne } from "./gen-utils";
import { FEMALE_DOG_NAMES, MALE_DOG_NAMES } from "./name-lists";
import { generateRandomGUID } from "@/lib/utilities/bark-guid";
import { getTestBirthday } from "../e2e-test-utils";
import { sprintf } from "sprintf-js";

export function generateDog(options?: { dogGender?: "MALE" | "FEMALE" }): {
  dogName: string;
  dogBreed: string;
  dogBirthday: string;
  dogWeightKg: string;
  ageYears: number;
} {
  const dogGender = options?.dogGender ?? "MALE";
  const nameList = dogGender === "MALE" ? MALE_DOG_NAMES : FEMALE_DOG_NAMES;
  const guid = generateRandomGUID(4);
  const dogName = `${pickOne(nameList)} E2E${guid}`;
  const dogBreeds = dogBreedsJson.dog_breeds.map((entry) => entry.dog_breed);
  const dogBreed = pickOne(dogBreeds);
  const ageYears = pickOne([3, 4, 5, 6]);
  const dogBirthday = getTestBirthday(ageYears);
  const dogWeightKg = sprintf("%.1f", 20 + Math.random() * 20);
  const result = { dogName, dogBreed, dogBirthday, dogWeightKg, ageYears };
  console.log("Generated Dog", result);
  return result;
}
