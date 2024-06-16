import { sprintf } from "sprintf-js";
import { PomContext } from "./pom/core/pom-object";
import { HeaderComponent } from "./pom/layout/header-component";
import {
  SGT_UI_DATE,
  SINGAPORE_TIME_ZONE,
  formatDateTime,
  parseCommonDate,
} from "@/lib/utilities/bark-time";

export function getTestBirthday(ageYears: number): string {
  const ts = new Date();
  const y = ts.getUTCFullYear() - ageYears;
  const m = ts.getUTCMonth() + 1;
  const d = ts.getUTCDate();
  const ymd = sprintf("%04d-%02d-%02d", y, m, d);
  const birthdayDate = parseCommonDate(ymd, SINGAPORE_TIME_ZONE);
  const birthdayString = formatDateTime(birthdayDate, SGT_UI_DATE);
  return birthdayString;
}

export async function getIsMobile(context: PomContext): Promise<boolean> {
  const header = new HeaderComponent(context);
  const hamburger = header.hamburgerButton();
  const hasHamburger = await hamburger.isVisible();
  return hasHamburger;
}
