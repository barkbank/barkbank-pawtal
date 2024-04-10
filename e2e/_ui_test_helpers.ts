import { test, expect, Page } from "@playwright/test";

export const UI_URLS = {
  USER_LOGIN: "http://localhost:3000/user/login",
  USER_MY_PETS: "http://localhost:3000/user/my-pets",
  USER_MY_ACCOUNT: "http://localhost:3000/user/my-account",
  ROOT: "http://localhost:3000/",
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
  await expect(page).toHaveURL(UI_URLS.USER_MY_PETS);
}
