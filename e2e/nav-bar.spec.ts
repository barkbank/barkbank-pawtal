import { test, expect, Page } from "@playwright/test";
import { UI_LOCATOR, UI_URLS, loginTestUser } from "./_ui_test_helpers";
import { RoutePath } from "@/lib/route-path";

test.describe("nav bar when not logged-in", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(UI_URLS.ROOT);
    const menuButton = page.locator(UI_LOCATOR.NAV_MENU_BUTTON);
    if (await menuButton.isVisible()) {
      await menuButton.click();
    }
  });
  test("it should have Visit FAQ", async ({ page }) => {
    const link = page
      .locator(UI_LOCATOR.NAV_BAR)
      .getByRole("link", { name: "Visit FAQ" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("href", RoutePath.VISIT_FAQ);
  });
  test("it should have Visit Website", async ({ page }) => {
    const link = page
      .locator(UI_LOCATOR.NAV_BAR)
      .getByRole("link", { name: "Visit Website" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("href", RoutePath.VISIT_WEBSITE);
  });
  test("it should not have a Logout option", async ({ page }) => {
    const link = page
      .locator(UI_LOCATOR.NAV_BAR)
      .getByRole("link", { name: "Logout" });
    await expect(link).not.toBeVisible();
  });
});

test.describe("nav bar when logged-in as user", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(UI_URLS.ROOT);
    await loginTestUser({ page });
    const menuButton = page.locator(UI_LOCATOR.NAV_MENU_BUTTON);
    if (await menuButton.isVisible()) {
      await menuButton.click();
    }
  });
  test("it should have Visit FAQ", async ({ page }) => {
    const link = page
      .locator(UI_LOCATOR.NAV_BAR)
      .getByRole("link", { name: "Visit FAQ" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("href", RoutePath.VISIT_FAQ);
  });
  test("it should have Visit Website", async ({ page }) => {
    const link = page
      .locator(UI_LOCATOR.NAV_BAR)
      .getByRole("link", { name: "Visit Website" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("href", RoutePath.VISIT_WEBSITE);
  });
  test("it should have a Logout option", async ({ page }) => {
    const link = page
      .locator(UI_LOCATOR.NAV_BAR)
      .getByRole("link", { name: "Logout" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", RoutePath.LOGOUT_PAGE);
  });
});

test.describe("nav bar logout flow", () => {
  test("for user", async ({ page }) => {
    await page.goto(UI_URLS.ROOT);
    await loginTestUser({ page });
    const menuButton = page.locator(UI_LOCATOR.NAV_MENU_BUTTON);
    if (await menuButton.isVisible()) {
      await menuButton.click();
    }
    await page
      .locator(UI_LOCATOR.NAV_BAR)
      .getByRole("link", { name: "Logout" })
      .click();
    await page.waitForURL(UI_URLS.LOGOUT_PAGE);
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page).toHaveURL(UI_URLS.ROOT);
  });
});
