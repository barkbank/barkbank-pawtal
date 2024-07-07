import { pickOne } from "./pick-one";
import { FEMALE_DOG_NAMES, MALE_DOG_NAMES } from "../data/name-lists";
import { generateRandomGUID } from "@/lib/utilities/bark-guid";
import { getTestBirthday } from "./get-test-birthday";
import { sprintf } from "sprintf-js";
import { GeneratedDog, GeneratedDogSchema } from "../models/generated-dog";
import { toUiWeightKg } from "./to-ui-weight-kg";
import { getDogBreeds } from "@/app/_lib/get-dog-breeds";

export function generateDog(options?: {
  dogGender?: "MALE" | "FEMALE";
}): GeneratedDog {
  const dogGender =
    options?.dogGender ?? pickOne<"MALE" | "FEMALE">(["FEMALE", "MALE"]);
  const nameList = dogGender === "MALE" ? MALE_DOG_NAMES : FEMALE_DOG_NAMES;
  const guid = generateRandomGUID(4);
  const dogName = `${pickOne(nameList)} (${guid})`;
  const dogBreeds = getDogBreeds();
  const dogBreed = pickOne(dogBreeds);
  const ageYears = pickOne([3, 4, 5, 6]);
  const dogBirthday = getTestBirthday(ageYears);
  const dogWeightKg = toUiWeightKg(sprintf("%.1f", 20 + Math.random() * 20));
  const result: GeneratedDog = {
    dogName,
    dogBreed,
    dogGender,
    dogBirthday,
    dogWeightKg,
    ageYears,
  };
  console.log("Generated Dog", result);
  return GeneratedDogSchema.parse(result);
}
