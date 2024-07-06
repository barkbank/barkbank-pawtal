import { test, expect } from "@playwright/test";
import { UserMyAccountEditPage } from "../_lib/pom/pages/user-my-account-edit-page";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doRegister } from "../_lib/ops/do-register";
import { NavComponent } from "../_lib/pom/layout/nav-component";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";
import { UserMyAccountPage } from "../_lib/pom/pages/user-my-account-page";

test("user can register, edit account details, save, and should see their details changed", async ({
  page,
}) => {
  // GIVEN
  const context = await initPomContext({ page });
  const {
    user: { userName, userEmail, userPhoneNumber },
  } = await doRegister(context);

  const nav = new NavComponent(context);
  const pgPets = new UserMyPetsPage(context);
  const pgMyAccount = new UserMyAccountPage(context);
  const pgEditMyAccount = new UserMyAccountEditPage(context);

  // Navigate to My Accounts
  await pgPets.checkReady();
  await nav.myAcountOption().click();
  await pgMyAccount.checkReady();

  // Check existing details
  await expect(pgMyAccount.exactText(userName)).toBeVisible();
  await expect(pgMyAccount.residencyItem()).toHaveValue("Singapore");
  await expect(pgMyAccount.emailItem()).toHaveValue(userEmail);
  await expect(pgMyAccount.phoneNumberItem()).toHaveValue(userPhoneNumber);

  // WHEN user navigates to edit page, and saves
  await pgMyAccount.editButton().click();
  await pgEditMyAccount.checkReady();
  await pgEditMyAccount.userNameField().fill("New Name");
  await pgEditMyAccount.userPhoneNumberField().fill("+65 12345678");
  await pgEditMyAccount.userResidencyOption_OTHERS().click();
  await pgEditMyAccount.saveButton().click();

  // THEN
  await pgMyAccount.checkReady();
  await expect(pgMyAccount.exactText("New Name")).toBeVisible();
  await expect(pgMyAccount.residencyItem()).toHaveValue("Other");
  await expect(pgMyAccount.emailItem()).toHaveValue(userEmail);
  await expect(pgMyAccount.phoneNumberItem()).toHaveValue("+65 12345678");
});
