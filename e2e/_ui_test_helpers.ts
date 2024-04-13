import { RoutePath } from "@/lib/route-path";
import { expect, Page } from "@playwright/test";

function getLocalUrl(path: string): string {
  return `http://localhost:3000${path}`;
}

export const UI_URLS = {
  ROOT: getLocalUrl(RoutePath.ROOT),
  LOGOUT_PAGE: getLocalUrl(RoutePath.LOGOUT_PAGE),

  USER_LOGGED_IN_PAGE: getLocalUrl(RoutePath.USER_DEFAULT_LOGGED_IN_PAGE),
  USER_LOGIN: getLocalUrl(RoutePath.USER_LOGIN_PAGE),
  USER_MY_PETS: getLocalUrl(RoutePath.USER_MY_PETS),
  USER_MY_ACCOUNT: getLocalUrl(RoutePath.USER_MY_ACCOUNT_PAGE),

  EXTERNAL_FAQ_PAGE: RoutePath.VISIT_FAQ,
  EXTERNAL_WEBSITE_PAGE: RoutePath.VISIT_WEBSITE,
} as const;

export const UI_LOCATOR = {
  NAV_BAR: "#nav-bar",
  NAV_MENU_BUTTON: "#nav-menu-button",
  SIDEBAR: "#sidebar",
} as const;

export const UI_USER = {
  USER_EMAIL: "test_user@user.com",
  USER_NAME: "Tess Yu Ser",
  USER_PHONE_NUMBER: "+65 30002000",
  ELIGIBLE_DOG_NAME: "Mape",
  TEMPORARILY_INELIGIBLE_DOG_NAME: "Ridley",
  PERMANENTLY_INELIGIBLE_DOG_NAME: "Perry",
} as const;

export async function loginTestUser(args: { page: Page }) {
  const { page } = args;
  await page.goto(UI_URLS.USER_LOGIN);
  await page.getByLabel("Please provide your email").fill(UI_USER.USER_EMAIL);
  await page.getByRole("button", { name: "Send me an OTP" }).click();
  await expect(page.getByText(UI_USER.USER_EMAIL)).toBeVisible();
  await page.getByLabel("Enter OTP").fill("000000");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(UI_URLS.USER_LOGGED_IN_PAGE);
}
