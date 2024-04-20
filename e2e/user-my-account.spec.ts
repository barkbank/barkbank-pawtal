import { test, expect } from "@playwright/test";
import { UI_USER, loginTestUser } from "./_lib/login-test-account";
import { urlOf } from "./_lib/e2e-test-utils";
import { RoutePath } from "@/lib/route-path";

test.beforeEach(async ({ page }) => {
  await loginTestUser({ page });
  await page.getByRole("link", { name: "Icon for the My Account" }).click();
  await page.waitForURL(urlOf(RoutePath.USER_MY_ACCOUNT_PAGE));
});

test.describe("user my account", () => {
  test("it shows the user account details", async ({ page }) => {
    await expect(page.getByText(UI_USER.USER_NAME)).toBeVisible();
    await expect(page.getByText("Singapore")).toBeVisible();
    await expect(page.getByText(UI_USER.USER_EMAIL)).toBeVisible();
    await expect(page.getByText(UI_USER.USER_PHONE_NUMBER)).toBeVisible();
    await expect(page.getByText("Account created on")).toBeVisible();
  });
  test("it has an edit button", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Edit" })).toBeVisible();
  });
  test("it has no delete button", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Delete" })).not.toBeVisible();
  });
});
