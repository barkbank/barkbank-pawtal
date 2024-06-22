import { PomContext } from "../pom/core/pom-object";
import { NavComponent } from "../pom/layout/nav-component";
import { UserMyAccountPage } from "../pom/pages/user-my-account-page";
import { UserMyPetsPage } from "../pom/pages/user-my-pets-page";

/**
 * @deprecated TODO: remove use of navigation sequences like this.
 */
export async function gotoUserMyAccountPage(args: {
  context: PomContext;
}): Promise<UserMyAccountPage> {
  const { context } = args;
  const nav = new NavComponent(context);
  await nav.myAcountOption().click();
  const pg = new UserMyAccountPage(context);
  await pg.checkUrl();
  return pg;
}

/**
 * @deprecated TODO: remove use of navigation sequences like this.
 */
export async function gotoUserMyPetsPage(args: {
  context: PomContext;
}): Promise<UserMyPetsPage> {
  const { context } = args;
  const nav = new NavComponent(context);
  await nav.myPetsOption().click();
  const pg = new UserMyPetsPage(context);
  await pg.checkUrl();
  return pg;
}
