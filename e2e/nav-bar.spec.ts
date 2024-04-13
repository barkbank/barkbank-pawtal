import { test, expect, Page } from "@playwright/test";
import { UI_URLS } from "./_ui_test_helpers";

test.describe("nav bar when not logged-in", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(UI_URLS.ROOT);
    const menuButton = page.locator("#nav-menu-button");
    if (await menuButton.isVisible()) {
      await menuButton.click();
    }
  });
  test("it should have Visit FAQ", async ({ page }) => {
    const link = page.getByRole("link", { name: "Visit FAQ" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("href", "https://www.barkbank.co/faq");
  });
  test("it should have Visit Website", async ({ page }) => {
    const link = page.getByRole("link", { name: "Visit Website" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("href", "https://www.barkbank.co/");
  });
});
