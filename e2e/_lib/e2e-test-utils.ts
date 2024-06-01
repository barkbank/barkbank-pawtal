import { sprintf } from "sprintf-js";
import { PomContext } from "./pom/core/pom-object";
import { HeaderComponent } from "./pom/layout/header-component";
import { generateDog } from "./generate/generate-dog";

export function generateTestDogName(options?: {
  dogGender?: "MALE" | "FEMALE";
}): string {
  const dogGender = options?.dogGender ?? "MALE";
  const { dogName } = generateDog({ dogGender });
  return dogName;
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
