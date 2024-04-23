import { test, expect } from "@playwright/test";
import { loginKnownUser } from "../_lib/pom/init/login-known-user";
import { gotoUserMyAccountPage } from "../_lib/sequences/nav-gotos";

test("user can view their account", async ({ page }) => {
  const { context, knownUser } = await loginKnownUser(page);
  const accountPage = await gotoUserMyAccountPage({ context });
  const { userName, userEmail, userPhoneNumber, userResidency } = knownUser;
  await expect(accountPage.exactText(userName)).toBeVisible();
  await expect(accountPage.exactText(userEmail)).toBeVisible();
  await expect(accountPage.exactText(userPhoneNumber)).toBeVisible();
  await expect(accountPage.exactText(userResidency)).toBeVisible();
});
