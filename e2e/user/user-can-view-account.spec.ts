import { test, expect } from "@playwright/test";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doLoginKnownUser } from "../_lib/ops/do-login-known-user";
import { NavComponent } from "../_lib/pom/layout/nav-component";
import { UserMyAccountPage } from "../_lib/pom/pages/user-my-account-page";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";

test("user can view their account", async ({ page }) => {
  const context = await initPomContext({ page });
  const knownUser = await doLoginKnownUser(context);

  const nav = new NavComponent(context);
  const pgMyPets = new UserMyPetsPage(context);
  const pgAccount = new UserMyAccountPage(context);

  await pgMyPets.checkUrl();
  await nav.myAcountOption().click();
  await pgAccount.checkUrl();

  const { userName, userEmail, userPhoneNumber, userResidency } = knownUser;
  await expect(pgAccount.exactText(userName)).toBeVisible();
  await expect(pgAccount.residencyItem()).toHaveValue(userResidency);
  await expect(pgAccount.emailItem()).toHaveValue(userEmail);
  await expect(pgAccount.phoneNumberItem()).toHaveValue(userPhoneNumber);
});
