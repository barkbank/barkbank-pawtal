import { sprintf } from "sprintf-js";
import { PomContext } from "./pom/core/pom-object";
import { HeaderComponent } from "./pom/layout/header-component";
import { RequiredDateField } from "@/app/_lib/field-schemas/required-date-field";

export function getTestBirthday(ageYears: number): string {
  const ts = new Date();
  const y = ts.getUTCFullYear() - ageYears;
  const m = ts.getUTCMonth() + 1;
  const d = ts.getUTCDate();
  const ymd = sprintf("%04d-%02d-%02d", y, m, d);
  const field = RequiredDateField.new();
  const birthdayDate = field.parse(ymd);
  const birthdayString = field.format(birthdayDate);
  return birthdayString;
}

export async function getIsMobile(context: PomContext): Promise<boolean> {
  const header = new HeaderComponent(context);
  const hamburger = header.hamburgerButton();
  const hasHamburger = await hamburger.isVisible();
  return hasHamburger;
}
