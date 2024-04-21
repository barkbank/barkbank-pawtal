import { generateRandomGUID } from "@/lib/utilities/bark-guid";
import { formatDateTime, SINGAPORE_TIME_ZONE } from "@/lib/utilities/bark-time";
import { sprintf } from "sprintf-js";
import { Website } from "./pom/website";

export const UI_LOCATOR = {
  NAV_BAR: "#bark-nav-bar",
  NAV_MENU_BUTTON: "#bark-nav-menu-button",
  SIDEBAR: "#bark-sidebar",
  FOOTER: "#bark-footer",
} as const;

export function urlOf(path: string): string {
  return `http://localhost:3000${path}`;
}

export function getLocalhostWebsite(): Website {
  return new Website("http://localhost:3000");
}

export function generateTestDogName(): string {
  const tsid = formatDateTime(new Date(), {
    format: "d MMM yyyy",
    timeZone: SINGAPORE_TIME_ZONE,
  });
  const guid = generateRandomGUID(6);
  return `Kelper (${tsid}, ${guid})`;
}

export function getTestBirthday(ageYears: number): string {
  const ts = new Date();
  const y = ts.getUTCFullYear() - ageYears;
  const m = ts.getUTCMonth() + 1;
  const d = ts.getUTCDate();
  const ymd = sprintf("%04d-%02d-%02d", y, m, d);
  return ymd;
}
