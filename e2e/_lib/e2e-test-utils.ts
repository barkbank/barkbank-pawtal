import { generateRandomGUID } from "@/lib/utilities/bark-guid";
import { formatDateTime, SINGAPORE_TIME_ZONE } from "@/lib/utilities/bark-time";
import { sprintf } from "sprintf-js";
import { PomContext } from "./pom/core/pom-object";
import { HeaderComponent } from "./pom/layout/header-component";

const MALE_DOG_NAMES = [
  "Bailey",
  "Barkus",
  "Bear",
  "Bentley",
  "Buddy",
  "Charlie",
  "Cooper",
  "Dingo",
  "Duke",
  "Jack",
  "Max",
  "Milo",
  "Oliver",
  "Peter",
  "Rocky",
  "Teddy",
  "Toby",
  "Woofus",
  "Zeus",
];

const FEMALE_DOG_NAMES = [
  "Aurora",
  "Bella",
  "Carol",
  "Chloe",
  "Daisy",
  "Lily",
  "Lola",
  "Lucy",
  "Luna",
  "Maggie",
  "Molly",
  "Olive",
  "Rosie",
  "Ruby",
  "Sadie",
  "Sophie",
  "Stella",
  "Vella",
  "Zoe",
];

export function generateTestDogName(options?: {
  dogGender?: "MALE" | "FEMALE";
}): string {
  const dogGender = options?.dogGender ?? "MALE";
  const nameList = dogGender === "MALE" ? MALE_DOG_NAMES : FEMALE_DOG_NAMES;
  const n = nameList.length;
  const i = Math.floor(Math.random() * n) % n;
  const j = Math.floor(Math.random() * n) % n;
  const dogName = `${nameList[i]} ${nameList[j]}`;
  const tsid = formatDateTime(new Date(), {
    format: "d MMM yyyy HH:mm",
    timeZone: SINGAPORE_TIME_ZONE,
  });
  return `${dogName} (${tsid})`;
}

export function getTestBirthday(ageYears: number): string {
  const ts = new Date();
  const y = ts.getUTCFullYear() - ageYears;
  const m = ts.getUTCMonth() + 1;
  const d = ts.getUTCDate();
  const ymd = sprintf("%04d-%02d-%02d", y, m, d);
  return ymd;
}

export async function getIsMobile(context: PomContext): Promise<boolean> {
  const header = new HeaderComponent(context);
  const hamburger = header.hamburgerButton();
  const hasHamburger = await hamburger.isVisible();
  return hasHamburger;
}
