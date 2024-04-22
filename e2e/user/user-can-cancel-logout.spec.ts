import { test, expect } from "@playwright/test";
import { loginKnownUser } from "../_lib/pom/init";
import { NavbarComponent } from "../_lib/pom/layout/navbar-component";
import { LogoutPage } from "../_lib/pom/pages/logout-page";
import { SidebarComponent } from "../_lib/pom/layout/sidebar-component";
import { UserMyAccountPage } from "../_lib/pom/pages/user-my-account-page";

test("user can cancel logout", async ({ page }) => {
  const { pomPage } = await loginKnownUser(page);
  const ctx = pomPage.context();

  const sb = new SidebarComponent(ctx);
  await sb.gotoMyAccount();

  const nav = new NavbarComponent(ctx);
  if (await nav.hamburgerButton().isVisible()) {
    await nav.hamburgerButton().click();
  }
  await expect(nav.logoutLink()).toBeVisible();
  await nav.logoutLink().click();

  const logoutPage = new LogoutPage(ctx);
  await logoutPage.checkUrl();
  await expect(logoutPage.cancelButton()).toBeVisible();
  await logoutPage.cancelButton().click();

  // Should be back at my account page.
  const myAccountPage = new UserMyAccountPage(ctx);
  await myAccountPage.checkUrl();
});
