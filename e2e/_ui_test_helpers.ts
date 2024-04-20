import { RoutePath } from "@/lib/route-path";
import { generateRandomGUID } from "@/lib/utilities/bark-guid";
import { formatDateTime, SINGAPORE_TIME_ZONE } from "@/lib/utilities/bark-time";
import { expect, Page } from "@playwright/test";
import { sprintf } from "sprintf-js";

export function urlOf(path: string): string {
  return `http://localhost:3000${path}`;
}

export const UI_LOCATOR = {
  NAV_BAR: "#bark-nav-bar",
  NAV_MENU_BUTTON: "#bark-nav-menu-button",
  SIDEBAR: "#bark-sidebar",
  FOOTER: "#bark-footer",
} as const;

export const UI_USER = {
  USER_EMAIL: "test_user@user.com",
  USER_NAME: "Tess Yu Ser",
  USER_PHONE_NUMBER: "+65 30002000",
  ELIGIBLE_DOG_NAME: "Mape",
  TEMPORARILY_INELIGIBLE_DOG_NAME: "Ridley",
  PERMANENTLY_INELIGIBLE_DOG_NAME: "Perry",
} as const;

export const UI_VET = {
  VET_EMAIL: "vet1@vet.com",
};

export const UI_ADMIN = {
  ADMIN_EMAIL: "admin1@admin.com",
};

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

export async function registerTestUser(args: { page: Page }): Promise<{
  guid: string;
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  dogName: string;
  dogBreed: string;
}> {
  const guid = generateRandomGUID(8);
  const userName = `Alice (${guid})`;
  const userEmail = `alice.${guid}@user.com`;
  const userPhoneNumber = guid;
  const dogName = `Bob (${guid})`;
  const dogBreed = "REGISTERED DOG";

  const { page } = args;
  await page.goto(urlOf(RoutePath.USER_REGISTRATION));
  await expect(page).toHaveURL(urlOf(RoutePath.USER_REGISTRATION));

  // Pet Form
  await page.getByLabel("What's your dog's name?").fill(dogName);
  await page.getByLabel("What's your dog's breed?").fill(dogBreed);
  await page.locator('input[name="dogBirthday"]').fill(getTestBirthday(5));
  await page.getByRole("button", { name: "Male", exact: true }).click();
  await page.getByLabel("What's your dog's weight? (KG)").fill("31.4");
  await page
    .getByText("Do you know it's blood type?I")
    .getByLabel("I don't know")
    .click();
  await page
    .getByText("Has it received blood transfusion before?I don't knowYesNo")
    .locator('[id="\\:R11rrrqkq\\:-form-item"]')
    .getByRole("button", { name: "No", exact: true })
    .click();
  await page
    .getByText("Has your dog been pregnant before?I don't knowYesNo")
    .locator('[id="\\:R15rrrqkq\\:-form-item"]')
    .getByRole("button", { name: "No", exact: true })
    .click();
  await page.getByLabel("Vet Clinic 1").click();
  await page.getByRole("button", { name: "Next" }).click();

  // Human Form
  await page
    .getByText("Are you currently based in Singapore?YesNo")
    .getByRole("button", { name: "Yes" })
    .click();
  await page.getByLabel("How would you like to be").fill(userName);
  await page.getByLabel("What number can we reach you").fill(userPhoneNumber);
  await page.getByLabel("Please provide a login email").fill(userEmail);
  await page.getByLabel("Enter OTP").fill("000000");
  await page.getByLabel("Disclaimer").click();
  await page.getByRole("button", { name: "Submit" }).click();

  await page.getByRole("button", { name: "Enter My Dashboard" }).click();
  await expect(page).toHaveURL(urlOf(RoutePath.USER_DEFAULT_LOGGED_IN_PAGE));
  return { guid, userName, userEmail, userPhoneNumber, dogName, dogBreed };
}

export async function loginTestUser(args: { page: Page }) {
  const { page } = args;
  await page.goto(urlOf(RoutePath.USER_LOGIN_PAGE));
  await page.getByLabel("Please provide your email").fill(UI_USER.USER_EMAIL);
  await page.getByRole("button", { name: "Send me an OTP" }).click();
  await expect(page.getByText(UI_USER.USER_EMAIL)).toBeVisible();
  await page.getByLabel("Enter OTP").fill("000000");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(urlOf(RoutePath.USER_DEFAULT_LOGGED_IN_PAGE));
}

export async function loginTestVet(args: { page: Page }) {
  const { page } = args;
  await page.goto(urlOf(RoutePath.VET_LOGIN_PAGE));
  await page.getByLabel("Please provide your email").fill(UI_VET.VET_EMAIL);
  await page.getByRole("button", { name: "Send me an OTP" }).click();
  await expect(page.getByText(UI_VET.VET_EMAIL)).toBeVisible();
  await page.getByLabel("Enter OTP").fill("000000");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(urlOf(RoutePath.VET_DEFAULT_LOGGED_IN_PAGE));
}

export async function loginTestAdmin(args: { page: Page }) {
  const { page } = args;
  await page.goto(urlOf(RoutePath.ADMIN_LOGIN_PAGE));
  await page.getByLabel("Please provide your email").fill(UI_ADMIN.ADMIN_EMAIL);
  await page.getByRole("button", { name: "Send me an OTP" }).click();
  await expect(page.getByText(UI_ADMIN.ADMIN_EMAIL)).toBeVisible();
  await page.getByLabel("Enter OTP").fill("000000");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(urlOf(RoutePath.ADMIN_DEFAULT_LOGGED_IN_PAGE));
}
