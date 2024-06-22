import { test, expect } from "@playwright/test";
import { HeaderComponent } from "../_lib/pom/layout/header-component";
import { LogoutPage } from "../_lib/pom/pages/logout-page";
import { UserMyAccountPage } from "../_lib/pom/pages/user-my-account-page";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doLoginKnownUser } from "../_lib/ops/do-login-known-user";
import { NavComponent } from "../_lib/pom/layout/nav-component";

test("user can cancel logout", async ({ page }) => {
  const context = await initPomContext({ page });
  await doLoginKnownUser(context);

  const header = new HeaderComponent(context);
  const nav = new NavComponent(context);
  const pgLogout = new LogoutPage(context);
  const pgMyAcc = new UserMyAccountPage(context);

  // Navigate to My Account page first. We expect to return here if we cancel
  // the logout.
  await nav.myAcountOption().click();
  await pgMyAcc.checkUrl();

  if (await header.hamburgerButton().isVisible()) {
    await header.hamburgerButton().click();
  }
  await expect(header.logoutLink()).toBeVisible();
  await header.logoutLink().click();

  await pgLogout.checkUrl();
  await expect(pgLogout.cancelButton()).toBeVisible();
  await pgLogout.cancelButton().click();

  // Should be back at my account page.
  await pgMyAcc.checkUrl();
});
