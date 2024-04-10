import { test, expect } from "@playwright/test";
import { UI_URLS, UI_USER, loginTestUser } from "./_ui_test_helpers";

test.beforeEach(async ({ page }) => {
  await loginTestUser({ page });
  await page.getByRole('link', { name: 'Icon for the My Account' }).click();
  await page.waitForURL(UI_URLS.USER_MY_ACCOUNT);
});

test.describe("user my account", () => {
  test("it shows the user account details", async ({ page }) => {
    await expect(page.getByText(UI_USER.USER_NAME)).toBeVisible();
    await expect(page.getByText("Singapore")).toBeVisible();
    await expect(page.getByText(UI_USER.USER_EMAIL)).toBeVisible();
    await expect(page.getByText(UI_USER.USER_PHONE_NUMBER)).toBeVisible();
    await expect(page.getByText("Account created on")).toBeVisible();
  });
});
