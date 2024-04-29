import { expect } from "@playwright/test";
import { HeaderComponent } from "../pom/layout/header-component";
import { UserLoginPage } from "../pom/pages/user-login-page";
import { LogoutPage } from "../pom/pages/logout-page";
import { PomContext } from "../pom/core/pom-object";

/**
 * @param args.context Should have a Logout option in the Navbar
 * @returns UserLoginPage
 */
export async function doLogoutSequence(args: {
  context: PomContext;
}): Promise<UserLoginPage> {
  const { context } = args;

  const navbar = new HeaderComponent(context);
  await expect(navbar.locator()).toBeVisible();
  if (await navbar.hamburgerButton().isVisible()) {
    await navbar.hamburgerButton().click();
  }
  await expect(navbar.logoutLink()).toBeVisible();
  await navbar.logoutLink().click();

  const logoutPage = new LogoutPage(context);
  await logoutPage.checkUrl();
  await logoutPage.logoutButton().click();

  const userLoginPage = new UserLoginPage(context);
  await userLoginPage.checkUrl();
  return userLoginPage;
}
