import { test, expect } from "@playwright/test";
import { UI_LOCATOR, UI_URLS, loginTestUser } from "./_ui_test_helpers";

test.describe("footer when not logged-in", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(UI_URLS.ROOT);
  });
  test("it should show options to login as vet", async ({ page }) => {
    await expect(
      page.locator(UI_LOCATOR.FOOTER).getByRole("link", { name: "Vet Login" }),
    ).toBeVisible();
  });
  test("it should show options to login as admin", async ({ page }) => {
    await expect(
      page
        .locator(UI_LOCATOR.FOOTER)
        .getByRole("link", { name: "Admin Login" }),
    ).toBeVisible();
  });
});

test.describe("footer when logged-in as a user", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(UI_URLS.ROOT);
    await loginTestUser({ page });
  });
  test("it should not show options to login as vet", async ({ page }) => {
    await expect(
      page.locator(UI_LOCATOR.FOOTER).getByRole("link", { name: "Vet Login" }),
    ).not.toBeVisible();
  });
  test("it should not show options to login as admin", async ({ page }) => {
    await expect(
      page
        .locator(UI_LOCATOR.FOOTER)
        .getByRole("link", { name: "Admin Login" }),
    ).not.toBeVisible();
  });
});
