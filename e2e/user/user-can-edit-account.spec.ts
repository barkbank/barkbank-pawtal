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

  // WHEN user navigates to edit page, and saves
  await accountPage.editButton().click();
  const editAccountPage = new UserMyAccountEditPage(context);
  await editAccountPage.checkUrl();
  await editAccountPage.userNameField().fill("New Name");
  await editAccountPage.userPhoneNumberField().fill("+65 12345678");
  await editAccountPage.userResidencyOption_OTHERS().click();
  await editAccountPage.saveButton().click();

  // THEN
  await expect(accountPage.exactText("New Name")).toBeVisible();
  await expect(accountPage.exactText(userEmail)).toBeVisible();
  await expect(accountPage.exactText("+65 12345678")).toBeVisible();
  await expect(accountPage.exactText("Other")).toBeVisible();
});
