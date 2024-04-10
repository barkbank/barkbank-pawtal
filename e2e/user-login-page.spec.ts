import { test, expect } from "@playwright/test";

const TARGET_URL = "http://localhost:3000/user/login";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/user/login");
});

test.describe("User Login Page", () => {
  test("contains expected elements", async ({ page }) => {
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

  test("validates email strings", async ({ page }) => {
    await page
      .getByLabel("Please provide your email")
      .fill("invalid-email-at-gmail-com");
    await page.getByRole("button", { name: "Send me an OTP" }).click();
    await expect(page.getByText("Invalid email address")).toBeVisible();
  });
});
