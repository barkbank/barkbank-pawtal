import { test, expect } from "@playwright/test";
import { loginTestUser } from "./_lib/login-test-account";
import { UI_LOCATOR } from "./_lib/e2e-test-utils";
import { RoutePath } from "@/lib/route-path";

test.describe("user sidebar", () => {
  test.beforeEach(async ({ page }) => {
    await loginTestUser({ page });
  });
  test("it should have My Pets", async ({ page }) => {
    const link = page
      .locator(UI_LOCATOR.SIDEBAR)
      .getByRole("link", { name: "My Pets" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", RoutePath.USER_MY_PETS);
  });
  test("it should have My Account", async ({ page }) => {
    const link = page
      .locator(UI_LOCATOR.SIDEBAR)
      .getByRole("link", { name: "My Account" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", RoutePath.USER_MY_ACCOUNT_PAGE);
  });
  test("it should have Criteria", async ({ page }) => {
    const link = page
      .locator(UI_LOCATOR.SIDEBAR)
      .getByRole("link", { name: "Criteria" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", RoutePath.USER_CRITERIA);
  });
  test("it should have Process", async ({ page }) => {
    const link = page
      .locator(UI_LOCATOR.SIDEBAR)
      .getByRole("link", { name: "Process" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", RoutePath.USER_PROCESS);
  });
});
