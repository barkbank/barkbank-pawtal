import { expect } from "@playwright/test";
import { PomPage } from "../pom/core/pom-page";
import { NavbarComponent } from "../pom/layout/navbar-component";
import { UserLoginPage } from "../pom/pages/user-login-page";
import { LogoutPage } from "../pom/pages/logout-page";

export async function doLogoutSequence(
  pomPage: PomPage,
): Promise<UserLoginPage> {
  const ctx = pomPage.context();

  const navbar = new NavbarComponent(ctx);
  await expect(navbar.locator()).toBeVisible();
  if (await navbar.hamburgerButton().isVisible()) {
    await navbar.hamburgerButton().click();
  }
  await expect(navbar.logoutLink()).toBeVisible();
  await navbar.logoutLink().click();

  const logoutPage = new LogoutPage(ctx);
  await logoutPage.checkUrl();
  await logoutPage.logoutButton().click();

  const userLoginPage = new UserLoginPage(ctx);
  await userLoginPage.checkUrl();
  return userLoginPage;
}
