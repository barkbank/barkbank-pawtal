import { test, expect } from "@playwright/test";
import { loginTestUser } from "./_lib/login-test-account";
import { UI_LOCATOR } from "./_lib/e2e-test-utils";
import { urlOf } from "./_lib/e2e-test-utils";
import { RoutePath } from "@/lib/route-path";

test.describe("nav bar when not logged-in", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(urlOf(RoutePath.USER_LOGIN_PAGE));
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
    await expect(link).toHaveAttribute("href", RoutePath.WEBSITE_FAQ_URL);
  });
  test("it should have Visit Website", async ({ page }) => {
    const link = page
      .locator(UI_LOCATOR.NAV_BAR)
      .getByRole("link", { name: "Visit Website" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("href", RoutePath.WEBSITE_URL);
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
    await expect(link).toHaveAttribute("href", RoutePath.WEBSITE_FAQ_URL);
  });
  test("it should have Visit Website", async ({ page }) => {
    const link = page
      .locator(UI_LOCATOR.NAV_BAR)
      .getByRole("link", { name: "Visit Website" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("href", RoutePath.WEBSITE_URL);
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
    // Given logged in user
    await loginTestUser({ page });
    const navBar = page.locator(UI_LOCATOR.NAV_BAR);
    const menuButton = page.locator(UI_LOCATOR.NAV_MENU_BUTTON);
    if (await menuButton.isVisible()) {
      await menuButton.click();
    }

    // When Logout option is selected
    await navBar.getByRole("link", { name: "Logout" }).click();

    // Then should enter the logout page
    await expect(page).toHaveURL(urlOf(RoutePath.LOGOUT_PAGE));

    // And logout button should be visible.
    const logoutButton = page.getByRole("button", { name: "Logout" });
    await expect(logoutButton).toBeVisible();

    // And if on mobile the menu should close so the logout option should not
    // be visible.
    if (await menuButton.isVisible()) {
      await expect(
        navBar.getByRole("link", { name: "Logout" }),
      ).not.toBeVisible();
    }

    // When logout button is clicked
    await logoutButton.click();

    // Then should return to user login page.
    await expect(page).toHaveURL(urlOf(RoutePath.USER_LOGIN_PAGE));
  });
});
