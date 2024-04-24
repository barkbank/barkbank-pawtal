import { test, expect } from "@playwright/test";
import { loginKnownUser } from "../_lib/pom/init/login-known-user";
import { gotoUserMyAccountPage } from "../_lib/sequences/nav-gotos";
import { UserMyAccountEditPage } from "../_lib/pom/pages/user-my-account-edit-page";

test("user can login, go to edit page, but cancel, and should not see their details changed", async ({
  page,
}) => {
  // GIVEN
  const { context, knownUser } = await loginKnownUser({ page });
  const accountPage = await gotoUserMyAccountPage({ context });
  const { userName, userEmail, userPhoneNumber, userResidency } = knownUser;
  await expect(accountPage.exactText(userName)).toBeVisible();
  await expect(accountPage.exactText(userEmail)).toBeVisible();
  await expect(accountPage.exactText(userPhoneNumber)).toBeVisible();
  await expect(accountPage.exactText(userResidency)).toBeVisible();

  // WHEN user clicks on edit button, navigate to edit page
  await accountPage.editButton().click();
  const editAccountPage = new UserMyAccountEditPage(context);
  await editAccountPage.checkUrl();

  // BUT cancelled, navigate back to account page
  await editAccountPage.cancelButton().click();

  // THEN
  await expect(accountPage.exactText(userName)).toBeVisible();
  await expect(accountPage.exactText(userEmail)).toBeVisible();
  await expect(accountPage.exactText(userPhoneNumber)).toBeVisible();
  await expect(accountPage.exactText(userResidency)).toBeVisible();
});
