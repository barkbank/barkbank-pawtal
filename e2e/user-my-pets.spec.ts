import { test, expect } from "@playwright/test";
import { UI_URLS, loginTestUser } from "./_ui_test_helpers";

test.beforeEach(async ({ page }) => {
  await loginTestUser({ page });
  await page.goto(UI_URLS.USER_MY_PETS);
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
  });
});
