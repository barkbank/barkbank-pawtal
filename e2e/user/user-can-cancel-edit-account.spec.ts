import { test, expect } from "@playwright/test";
import { gotoUserMyAccountPage } from "../_lib/sequences/nav-gotos";
import { UserMyAccountEditPage } from "../_lib/pom/pages/user-my-account-edit-page";
import { registerTestUser } from "../_lib/pom/init/register-test-user";

test("user can register, edit account details, but click cancel, and should see their details unchanged", async ({
  page,
}) => {
  // GIVEN
  const { context, userName, userEmail, userPhoneNumber } =
    await registerTestUser({
      page,
    });
  const accountPage = await gotoUserMyAccountPage({ context });
  await expect(accountPage.exactText(userName)).toBeVisible();
  await expect(accountPage.exactText("Singapore")).toBeVisible();
  await expect(accountPage.exactText(userEmail)).toBeVisible();
  await expect(accountPage.exactText(userPhoneNumber)).toBeVisible();

  // WHEN user clicks on edit button, navigate to edit page
  await accountPage.editButton().click();
  const editAccountPage = new UserMyAccountEditPage(context);
  await editAccountPage.checkUrl();

  // BUT cancelled, navigate back to account page
  await editAccountPage.userNameField().fill("New Name");
  await editAccountPage.userPhoneNumberField().fill("+65 12345678");
  await editAccountPage.userResidencyOption_OTHERS().click();
  await editAccountPage.cancelButton().click();

  // THEN
  await accountPage.checkUrl();
  await expect(accountPage.exactText(userName)).toBeVisible();
  await expect(accountPage.exactText("Singapore")).toBeVisible();
  await expect(accountPage.exactText(userEmail)).toBeVisible();
  await expect(accountPage.exactText(userPhoneNumber)).toBeVisible();
});