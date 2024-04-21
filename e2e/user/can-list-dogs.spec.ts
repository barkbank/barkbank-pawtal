import { test, expect } from "@playwright/test";
import { getLocalhostWebsite } from "../_lib/e2e-test-utils";
import { UserLoginPage } from "../_lib/pom/user-login-page";
import { UI_USER } from "../_lib/login-test-account";

test("user can list their dogs", async ({ page }) => {
  const pawtal = getLocalhostWebsite();
  const userLoginPage = new UserLoginPage({ page, pawtal });
  await page.goto(pawtal.urlOf("/"));
  const myPetsPage = await userLoginPage.login(UI_USER.USER_EMAIL);
  await expect(myPetsPage.locateDog(UI_USER.ELIGIBLE_DOG_NAME)).toBeVisible();
  await expect(
    myPetsPage.locateDog(UI_USER.PERMANENTLY_INELIGIBLE_DOG_NAME),
  ).toBeVisible();
  await expect(
    myPetsPage.locateDog(UI_USER.TEMPORARILY_INELIGIBLE_DOG_NAME),
  ).toBeVisible();
});
