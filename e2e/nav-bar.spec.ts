import { test, expect, Page } from "@playwright/test";
import { UI_LOCATOR, UI_URLS, loginTestUser } from "./_ui_test_helpers";

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
    await expect(link).toHaveAttribute("href", UI_URLS.EXTERNAL_FAQ_PAGE);
  });
  test("it should have Visit Website", async ({ page }) => {
    const link = page
      .locator(UI_LOCATOR.NAV_BAR)
      .getByRole("link", { name: "Visit Website" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("href", UI_URLS.EXTERNAL_WEBSITE_PAGE);
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
    await expect(link).toHaveAttribute("href", UI_URLS.EXTERNAL_FAQ_PAGE);
  });
  test("it should have Visit Website", async ({ page }) => {
    const link = page
      .locator(UI_LOCATOR.NAV_BAR)
      .getByRole("link", { name: "Visit Website" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("href", UI_URLS.EXTERNAL_WEBSITE_PAGE);
  });
  test("it should have a Logout option", async ({ page }) => {
    const link = page
      .locator(UI_LOCATOR.NAV_BAR)
      .getByRole("link", { name: "Logout" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("target", "");
    await expect(link).toHaveAttribute("href", UI_URLS.LOGOUT_PAGE);
  });
});
