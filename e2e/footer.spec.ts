import { test, expect } from "@playwright/test";
import { loginTestUser } from "./_lib/login-test-account";
import { UI_LOCATOR } from "./_lib/e2e-test-utils";
import { urlOf } from "./_lib/e2e-test-utils";
import { RoutePath } from "@/lib/route-path";

// WIP: rewrite as e2e/footer/footer-for-logged-in-user.spec.ts
test.describe("footer when logged-in as a user", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(urlOf(RoutePath.ROOT));
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
