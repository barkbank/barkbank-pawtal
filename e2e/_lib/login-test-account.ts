import { RoutePath } from "@/lib/route-path";
import { expect, Page } from "@playwright/test";
import { urlOf } from "./e2e-test-utils";

// WIP: remove this when no longer used
export const UI_USER = {
  USER_EMAIL: "test_user@user.com",
  USER_NAME: "Tess Yu Ser",
  USER_PHONE_NUMBER: "+65 30002000",
  ELIGIBLE_DOG_NAME: "Mape",
  TEMPORARILY_INELIGIBLE_DOG_NAME: "Ridley",
  PERMANENTLY_INELIGIBLE_DOG_NAME: "Perry",
} as const;

// WIP: remove this when no longer used
export const UI_VET = {
  VET_EMAIL: "vet1@vet.com",
};

// WIP: remove this when no longer used
export const UI_ADMIN = {
  ADMIN_EMAIL: "admin1@admin.com",
};

// WIP: delete this. It has been replaced with loginKnownUser.
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

// WIP: add known-vet.ts
// WIP: rewrite this as loginKnownVet in pom/init/login-known-vet
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

// WIP: add known-admin.ts
// WIP: rewrite this as loginKnownAdmin in pom/init/login-known-admin
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
