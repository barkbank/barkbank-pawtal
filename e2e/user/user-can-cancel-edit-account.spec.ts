import { test, expect } from "@playwright/test";
import { UserMyAccountEditPage } from "../_lib/pom/pages/user-my-account-edit-page";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doRegister } from "../_lib/ops/do-register";
import { NavComponent } from "../_lib/pom/layout/nav-component";
import { UserMyAccountPage } from "../_lib/pom/pages/user-my-account-page";

test("user can register, edit account details, but click cancel, and should see their details unchanged", async ({
  page,
}) => {
  // GIVEN
  const context = await initPomContext({ page });
  const {
    user: { userName, userEmail, userPhoneNumber },
  } = await doRegister(context);

  const nav = new NavComponent(context);
  const pgAcc = new UserMyAccountPage(context);
  const pgEdit = new UserMyAccountEditPage(context);

  await nav.myAcountOption().click();
  await pgAcc.checkUrl();

  await expect(pgAcc.exactText(userName)).toBeVisible();
  await expect(pgAcc.exactText("Singapore")).toBeVisible();
  await expect(pgAcc.exactText(userEmail)).toBeVisible();
  await expect(pgAcc.exactText(userPhoneNumber)).toBeVisible();

  // WHEN user clicks on edit button, navigate to edit page
  await pgAcc.editButton().click();
  await pgEdit.checkUrl();

  // BUT cancelled, navigate back to account page
  await pgEdit.userNameField().fill("New Name");
  await pgEdit.userPhoneNumberField().fill("+65 12345678");
  await pgEdit.userResidencyOption_OTHERS().click();
  await pgEdit.cancelButton().click();

  // THEN
  await pgAcc.checkUrl();
  await expect(pgAcc.exactText(userName)).toBeVisible();
  await expect(pgAcc.exactText("Singapore")).toBeVisible();
  await expect(pgAcc.exactText(userEmail)).toBeVisible();
  await expect(pgAcc.exactText(userPhoneNumber)).toBeVisible();
});
