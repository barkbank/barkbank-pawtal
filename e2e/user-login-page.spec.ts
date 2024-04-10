import { test, expect, Page } from "@playwright/test";

const TARGET_URL = "http://localhost:3000/user/login";

test("page contains expected elements", async ({ page }) => {
  await page.goto(TARGET_URL);
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
});
