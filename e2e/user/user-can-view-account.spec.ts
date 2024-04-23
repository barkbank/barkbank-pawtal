import { test, expect } from "@playwright/test";
import { initLoginKnownUser } from "../_lib/pom/init";
import { gotoUserMyAccountPage } from "../_lib/sequences/nav-gotos";

test("user can view their account", async ({ page }) => {
  const { context, knownUser } = await initLoginKnownUser(page);
  const accountPage = await gotoUserMyAccountPage({ context });
  const { userName, userEmail, userPhoneNumber, userResidency } = knownUser;
  await expect(accountPage.exactText(userName)).toBeVisible();
  await expect(accountPage.exactText(userEmail)).toBeVisible();
  await expect(accountPage.exactText(userPhoneNumber)).toBeVisible();
  await expect(accountPage.exactText(userResidency)).toBeVisible();
});
