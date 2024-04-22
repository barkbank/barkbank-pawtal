import { Page } from "@playwright/test";
import { Website } from "./website";
import { PomContext } from "./pom-context";
import { KnownUser, getKnownUser } from "./known-user";
import { UserMyPetsPage } from "./user-my-pets-page";
import { UserLoginPage } from "./user-login-page";

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
  petsPage: UserMyPetsPage;
}> {
  const ctx = await initPomContext(page);
  const knownUser = getKnownUser();
  const loginPage = new UserLoginPage(ctx);
  const petsPage = await loginPage.doLogin(knownUser.userEmail);
  return { knownUser, petsPage };
}
