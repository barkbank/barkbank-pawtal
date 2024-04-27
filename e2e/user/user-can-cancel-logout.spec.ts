import { test, expect } from "@playwright/test";
import { loginKnownUser } from "../_lib/pom/init/login-known-user";
import { NavbarComponent } from "../_lib/pom/layout/navbar-component";
import { LogoutPage } from "../_lib/pom/pages/logout-page";
import { UserMyAccountPage } from "../_lib/pom/pages/user-my-account-page";
import { gotoUserMyAccountPage } from "../_lib/sequences/nav-gotos";

test("user can cancel logout", async ({ page }) => {
  const { context } = await loginKnownUser({ page });

  // Navigate to My Account page first. We expect to return here if we cancel
  // the logout.
  await gotoUserMyAccountPage({ context });

  const nav = new NavbarComponent(context);
  if (await nav.hamburgerButton().isVisible()) {
    await nav.hamburgerButton().click();
  }
  await expect(nav.logoutLink()).toBeVisible();
  await nav.logoutLink().click();

  const logoutPage = new LogoutPage(context);
  await logoutPage.checkUrl();
  await expect(logoutPage.cancelButton()).toBeVisible();
  await logoutPage.cancelButton().click();

  // Should be back at my account page.
  const myAccountPage = new UserMyAccountPage(context);
  await myAccountPage.checkUrl();
});
