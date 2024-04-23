import { Page } from "@playwright/test";
import { PomContext } from "./core/pom-object";
import { getKnownUser } from "./known-user";
import { PomUser } from "./entities";
import { UserMyPetsPage } from "./pages/user-my-pets-page";
import { doUserLoginSequence } from "../sequences/user-login-sequence";
import { initPomContext } from "./init/init-pom-context";

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
