import { test, expect } from "@playwright/test";
import { loginTestUser } from "./_lib/login-test-account";
import { urlOf } from "./_lib/e2e-test-utils";
import { RoutePath } from "@/lib/route-path";

test.beforeEach(async ({ page }) => {
  await loginTestUser({ page });
  await page.getByRole("link", { name: "Icon for the My Pets option" }).click();
  await page.waitForURL(urlOf(RoutePath.USER_MY_PETS));
});

test.describe("user my pets", () => {
  test("it should list user pets", async ({ page }) => {
    await expect(
      page
        .locator("div")
        .filter({ hasText: "MapeEligibleMape is eligible" })
        .nth(3),
    ).toBeVisible();
    await expect(
      page.locator("div").filter({ hasText: "RidleyTemporarily" }).nth(3),
    ).toBeVisible();
    await expect(
      page
        .locator("div")
        .filter({ hasText: "PerryIneligiblePerry does not" })
        .nth(3),
    ).toBeVisible();
    await expect(
      page.locator("div").filter({ hasText: "BentleyProfile" }).nth(3),
    ).toBeVisible();
  });
});
