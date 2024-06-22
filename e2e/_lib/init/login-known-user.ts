import { Page } from "@playwright/test";
import { PomContext } from "../pom/core/pom-object";
import { getKnownUser } from "../known-entities/known-user";
import { PomUser } from "../pom/entities";
import { UserMyPetsPage } from "../pom/pages/user-my-pets-page";
import { doUserLoginSequence } from "../ops/do-user-login-sequence";
import { initPomContext } from "./init-pom-context";

/**
 * Initialise page and login as the Known User.
 *
 * The known user has an account that's prepopulated by make local-accounts.
 */
export async function loginKnownUser(args: { page: Page }): Promise<{
  context: PomContext;
  knownUser: PomUser;
  pomPage: UserMyPetsPage;
}> {
  const { page } = args;
  const context = await initPomContext({ page });
  const knownUser = getKnownUser();
  const { userEmail } = knownUser;
  const pomPage = await doUserLoginSequence({ context, userEmail });
  return { context, knownUser, pomPage };
}
