import { test, expect } from "@playwright/test";
import { loginKnownUser } from "../_lib/pom/init";

test("user can view their account", async ({ page }) => {
  const { knownUser, petsPage } = await loginKnownUser(page);
  const accountPage = await petsPage.sidebar().gotoMyAccount();
  const { userName, userEmail, userPhoneNumber, userResidency } = knownUser;
  await expect(accountPage.exactText(userName)).toBeVisible();
  await expect(accountPage.exactText(userEmail)).toBeVisible();
  await expect(accountPage.exactText(userPhoneNumber)).toBeVisible();
  await expect(accountPage.exactText(userResidency)).toBeVisible();
});
