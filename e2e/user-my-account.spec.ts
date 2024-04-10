import { test, expect, Page } from "@playwright/test";
import { UI_URLS, UI_USER, loginTestUser } from "./_ui_test_helpers";

test.beforeEach(async ({ page }) => {
  await loginTestUser({ page });
  await page.goto(UI_URLS.USER_MY_ACCOUNT);
});

test.describe("user my account", () => {
  test("it shows the user account details", async ({ page }) => {
    expect(page.getByText(UI_USER.USER_NAME)).toBeVisible();
    expect(page.getByText("Singapore")).toBeVisible();
    expect(page.getByText(UI_USER.USER_EMAIL)).toBeVisible();
    expect(page.getByText(UI_USER.USER_PHONE_NUMBER)).toBeVisible();
    expect(page.getByText("Account created on")).toBeVisible();
  });
});
