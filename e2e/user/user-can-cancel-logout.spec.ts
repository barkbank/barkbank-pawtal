import { test, expect } from "@playwright/test";
import { HeaderComponent } from "../_lib/pom/layout/header-component";
import { LogoutPage } from "../_lib/pom/pages/logout-page";
import { UserMyAccountPage } from "../_lib/pom/pages/user-my-account-page";
import { gotoUserMyAccountPage } from "../_lib/ops/nav-gotos";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doLoginKnownUser } from "../_lib/ops/do-login-known-user";

test("user can cancel logout", async ({ page }) => {
  const context = await initPomContext({ page });
  await doLoginKnownUser(context);

  // Navigate to My Account page first. We expect to return here if we cancel
  // the logout.
  await gotoUserMyAccountPage({ context });

  const header = new HeaderComponent(context);
  if (await header.hamburgerButton().isVisible()) {
    await header.hamburgerButton().click();
  }
  await expect(header.logoutLink()).toBeVisible();
  await header.logoutLink().click();

  const logoutPage = new LogoutPage(context);
  await logoutPage.checkUrl();
  await expect(logoutPage.cancelButton()).toBeVisible();
  await logoutPage.cancelButton().click();

  // Should be back at my account page.
  const myAccountPage = new UserMyAccountPage(context);
  await myAccountPage.checkUrl();
});
