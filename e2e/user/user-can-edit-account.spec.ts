import { test, expect } from "@playwright/test";
import { gotoUserMyAccountPage } from "../_lib/sequences/nav-gotos";
import { UserMyAccountEditPage } from "../_lib/pom/pages/user-my-account-edit-page";
import { registerTestUser } from "../_lib/init/register-test-user";

test("user can register, edit account details, save, and should see their details changed", async ({
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

  // WHEN user navigates to edit page, and saves
  await accountPage.editButton().click();
  const editAccountPage = new UserMyAccountEditPage(context);
  await editAccountPage.checkUrl();
  await editAccountPage.userNameField().fill("New Name");
  await editAccountPage.userPhoneNumberField().fill("+65 12345678");
  await editAccountPage.userResidencyOption_OTHERS().click();
  await editAccountPage.saveButton().click();

  // THEN
  await accountPage.checkUrl();
  await expect(accountPage.exactText("New Name")).toBeVisible();
  await expect(accountPage.exactText("Other")).toBeVisible();
  await expect(accountPage.exactText(userEmail)).toBeVisible();
  await expect(accountPage.exactText("+65 12345678")).toBeVisible();
});
