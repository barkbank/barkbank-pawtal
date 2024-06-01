import dogBreedsJson from "@/resources/dog_breeds.json";
import { pickOne } from "./gen-utils";
import { FEMALE_DOG_NAMES, MALE_DOG_NAMES } from "./name-lists";
import { generateRandomGUID } from "@/lib/utilities/bark-guid";

export function generateDog(options?: { dogGender?: "MALE" | "FEMALE" }): {
  dogName: string;
  dogBreed: string;
} {
  const dogGender = options?.dogGender ?? "MALE";
  const nameList = dogGender === "MALE" ? MALE_DOG_NAMES : FEMALE_DOG_NAMES;
  const guid = generateRandomGUID(4);
  const dogName = `${pickOne(nameList)} E2E${guid}`;
  const dogBreeds = dogBreedsJson.dog_breeds.map((entry) => entry.dog_breed);
  const dogBreed = pickOne(dogBreeds);
  return { dogName, dogBreed };
}
