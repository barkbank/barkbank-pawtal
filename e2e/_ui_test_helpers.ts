import { RoutePath } from "@/lib/route-path";
import { expect, Page } from "@playwright/test";

export function urlOf(path: string): string {
  return `http://localhost:3000${path}`;
}

// WIP: Remove UI_URLS
export const UI_URLS = {
  ROOT: urlOf(RoutePath.ROOT),
  LOGOUT_PAGE: urlOf(RoutePath.LOGOUT_PAGE),

  USER_LOGGED_IN_PAGE: urlOf(RoutePath.USER_DEFAULT_LOGGED_IN_PAGE),
  USER_LOGIN: urlOf(RoutePath.USER_LOGIN_PAGE),
  USER_MY_PETS: urlOf(RoutePath.USER_MY_PETS),
  USER_MY_ACCOUNT: urlOf(RoutePath.USER_MY_ACCOUNT_PAGE),

  VET_LOGIN: urlOf(RoutePath.VET_LOGIN_PAGE),

  EXTERNAL_FAQ_PAGE: RoutePath.VISIT_FAQ,
  EXTERNAL_WEBSITE_PAGE: RoutePath.VISIT_WEBSITE,
} as const;

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
