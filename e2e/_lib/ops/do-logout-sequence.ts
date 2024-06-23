import { expect } from "@playwright/test";
import { HeaderComponent } from "../pom/layout/header-component";
import { UserLoginPage } from "../pom/pages/user-login-page";
import { LogoutPage } from "../pom/pages/logout-page";
import { PomContext } from "../pom/core/pom-object";
import { doGetIsMobile } from "./do-get-is-mobile";

/**
 * @param args.context Should have a Logout option in the Navbar
 * @returns UserLoginPage
 */
export async function doLogoutSequence(context: PomContext) {
  const isMobile = await doGetIsMobile(context);

  const header = new HeaderComponent(context);
  const pgLogout = new LogoutPage(context);
  const pgUserLogin = new UserLoginPage(context);

  if (isMobile) {
    await header.hamburgerButton().click();
  }
  await expect(header.logoutLink()).toBeVisible();
  await header.logoutLink().click();
  await pgLogout.checkUrl();
  await pgLogout.logoutButton().click();
  await pgUserLogin.checkUrl();
}
