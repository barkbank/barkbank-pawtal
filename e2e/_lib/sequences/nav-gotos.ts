import { PomContext } from "../pom/core/pom-object";
import { SidebarComponent } from "../pom/layout/sidebar-component";
import { UserMyAccountPage } from "../pom/pages/user-my-account-page";
import { UserMyPetsPage } from "../pom/pages/user-my-pets-page";

export async function gotoUserMyAccountPage(args: {
  context: PomContext;
}): Promise<UserMyAccountPage> {
  const { context } = args;
  const sb = new SidebarComponent(context);
  await sb.myAcountOption().click();
  const pg = new UserMyAccountPage(context);
  await pg.checkUrl();
  return pg;
}

export async function gotoUserMyPetsPage(args: {
  context: PomContext;
}): Promise<UserMyPetsPage> {
  const { context } = args;
  const sb = new SidebarComponent(context);
  await sb.myPetsOption().click();
  const pg = new UserMyPetsPage(context);
  await pg.checkUrl();
  return pg;
}
