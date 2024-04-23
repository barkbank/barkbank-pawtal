import { Page } from "@playwright/test";
import { Website } from "./core/website";
import { PomContext, PomObject } from "./core/pom-object";
import { KnownUser, getKnownUser } from "./known-user";
import { UserLoginPage } from "./pages/user-login-page";
import { SidebarComponent } from "./layout/sidebar-component";
import { PomPage } from "./core/pom-page";
import { NavbarComponent } from "./layout/navbar-component";

export function getTestWebsite(): Website {
  return new Website("http://localhost:3000");
}

/**
 * Create and initialise a PomContext at the root of the test website.
 */
export async function initPomContext(page: Page): Promise<PomContext> {
  const website = getTestWebsite();
  await page.goto(website.urlOf("/"));
  return { page, website };
}

export async function loginKnownUser(page: Page): Promise<{
  knownUser: KnownUser;
  pomPage: PomPage;
}> {
  const ctx = await initPomContext(page);
  const knownUser = getKnownUser();
  const loginPage = new UserLoginPage(ctx);
  const pomPage = await loginPage.doLogin(knownUser.userEmail);
  return { knownUser, pomPage };
}

/**
 * @deprecated Use new SidebarComponent directly.
 */
export function sidebarOf(pomObject: PomObject): SidebarComponent {
  return new SidebarComponent(pomObject.context());
}

/**
 * @deprecated Use new NavbarComponent directly.
 */
export function navbarOf(pomObject: PomObject): NavbarComponent {
  return new NavbarComponent(pomObject.context());
}
