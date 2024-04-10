import { test, expect } from "@playwright/test";

const TARGET_URL = "http://localhost:3000/user/login";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/user/login");
});

test.describe("User Login Page", () => {
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

  test("it should validate email strings", async ({ page }) => {
    await page
      .getByLabel("Please provide your email")
      .fill("invalid-email-at-gmail-com");
    await page.getByRole("button", { name: "Send me an OTP" }).click();
    await expect(page.getByText("Invalid email address")).toBeVisible();
  });

  test("it should check account exists", async ({ page }) => {
    // Fill in a valid email that has no account
    await page
      .getByLabel("Please provide your email address")
      .fill("no_such_user@user.com");
    await expect(
      page.getByLabel("Please provide your email address"),
    ).toHaveValue("no_such_user@user.com");

    // Click button for requesting an OTP
    await page.getByRole("button", { name: "Send me an OTP" }).click();

    // Expect error message to show. (Known Issue: This assertion does not work
    // for webkit when executed in non-interactive mode.)
    await expect(page.getByText("User account does not exist.")).toBeVisible();
  });

  test("it should display form validation errors when submit is clicked", async ({
    page,
  }) => {
    // Click the login button.
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText("Invalid email")).toBeVisible();
    await expect(page.getByText("OTP cannot be empty")).toBeVisible();
  });
});
