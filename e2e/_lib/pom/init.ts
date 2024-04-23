import { Page } from "@playwright/test";
import { Website } from "./core/website";
import { PomContext, PomObject } from "./core/pom-object";
import { getKnownUser } from "./known-user";
import { PomUser } from "./entities";
import { SidebarComponent } from "./layout/sidebar-component";
import { NavbarComponent } from "./layout/navbar-component";
import { UserMyPetsPage } from "./pages/user-my-pets-page";
import { doUserLoginSequence } from "../sequences/user-login-sequence";

function _initWebsite(): Website {
  return new Website("http://localhost:3000");
}

/**
 * Create and initialise a PomContext at the root of the test website.
 */
export async function initPomContext(page: Page): Promise<PomContext> {
  const website = _initWebsite();
  await page.goto(website.urlOf("/"));
  return { page, website };
}

/**
 * Initialise page and login as the Known User.
 *
 * The known user has an account that's prepopulated by make local-accounts.
 */
export async function initLoginKnownUser(page: Page): Promise<{
  context: PomContext;
  knownUser: PomUser;
  pomPage: UserMyPetsPage;
}> {
  const context = await initPomContext(page);
  const knownUser = getKnownUser();
  const { userEmail } = knownUser;
  const pomPage = await doUserLoginSequence({ context, userEmail });
  return { context, knownUser, pomPage };
}

// WIP: initNewRegisteredUser(page: Page) -> {PomContext, PomUser, UserMyPetsPage}
