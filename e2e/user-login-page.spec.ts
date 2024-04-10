import { test, expect, Page } from "@playwright/test";
import { UI_URLS, UI_USER } from "./_ui_test_helpers";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URLS.USER_LOGIN);
});

test.describe("user login page", () => {
  test("it contains expected elements", async ({ page }) => {
    await expect(
      page.getByText("Bark Bank Canine Blood Donation Pawtal"),
    ).toBeVisible();
    await expect(page.getByText("User Login")).toBeVisible();
    await expect(
      page.getByText("Please provide your email address"),
    ).toBeVisible();
    await expect(page.getByText("Enter OTP")).toBeVisible();
    await expect(
      page.getByRole("button").getByText("Send me an OTP"),
    ).toBeVisible();
    await expect(page.getByRole("button").getByText("Cancel")).toBeVisible();
    await expect(page.getByRole("button").getByText("Login")).toBeVisible();

    // getByLabel selects input fields by associated label
    await expect(page.getByLabel("Please provide your email")).toBeEditable();
    await expect(page.getByLabel("Enter OTP")).toBeEditable();
  });
});

test.describe("user login validations", () => {
  test("it should validate email strings", async ({ page }) => {
    await fillEmail("invalid-email-at-gmail-com", page);
    await clickSendMeOtp(page);
    await expect(page.getByText("Invalid email address")).toBeVisible();
  });

  test("it should check account exists", async ({ page }) => {
    await fillEmail("no_such_user@user.com", page);
    await clickSendMeOtp(page);

    // Expect error message to show. (Known Issue: This assertion does not work
    // for webkit when executed in non-interactive mode.)
    await expect(page.getByText("User account does not exist.")).toBeVisible();
  });

  test("it should display form validation errors when login is clicked without filling in form", async ({
    page,
  }) => {
    await clickLogin(page);
    await expect(page.getByText("Invalid email")).toBeVisible();
    await expect(page.getByText("OTP cannot be empty")).toBeVisible();
  });
});

test.describe("user login flow", () => {
  test("it brings user to my pets page", async ({ page }) => {
    await fillEmail(UI_USER.USER_EMAIL, page);
    await clickSendMeOtp(page);
    await expectVisible(`An OTP has been sent to ${UI_USER.USER_EMAIL}`, page);
    await fillOtp("000000", page);
    await clickLogin(page);
    await expect(page).toHaveURL(UI_URLS.USER_MY_PETS);
  });
});

test.describe("user cancel login flow", () => {
  test("it brings user back to root", async ({ page }) => {
    await clickCancel(page);
    await expect(page).toHaveURL(UI_URLS.ROOT);
  });
});

async function expectVisible(text: string, page: Page) {
  await expect(page.getByText(text)).toBeVisible();
}

async function fillEmail(email: string, page: Page) {
  await page.getByLabel("Please provide your email").fill(email);
}

async function fillOtp(otp: string, page: Page) {
  await page.getByLabel("Enter OTP").fill(otp);
}

async function clickSendMeOtp(page: Page) {
  await page.getByRole("button", { name: "Send me an OTP" }).click();
}

async function clickLogin(page: Page) {
  await page.getByRole("button", { name: "Login" }).click();
}

async function clickCancel(page: Page) {
  await page.getByRole("button", { name: "Cancel" }).click();
}
