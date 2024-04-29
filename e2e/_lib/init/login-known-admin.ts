import { Page, expect } from "@playwright/test";
import { PomContext } from "../pom/core/pom-object";
import { PomAdmin } from "../pom/entities";
import { initPomContext } from "./init-pom-context";
import { VetLoginPage } from "../pom/pages/vet-login-page";
import { FooterComponent } from "../pom/layout/footer-component";
import { RoutePath } from "@/lib/route-path";
import { getKnownAdmin } from "../known-entities/known-admin";

export async function loginKnownAdmin(args: { page: Page }): Promise<{
  context: PomContext;
  knownAdmin: PomAdmin;
}> {
  const { page } = args;
  const context = await initPomContext({ page });
  const knownAdmin = getKnownAdmin();
  const footer = new FooterComponent(context);
  await footer.vetLoginLink().click();

  const pg = new VetLoginPage(context);
  await pg.checkUrl();
  await pg.emailField().fill(knownAdmin.adminEmail);
  await pg.otpField().fill("000000");
  await pg.loginButton().click();
  const url = context.website.urlOf(RoutePath.ADMIN_DEFAULT_LOGGED_IN_PAGE);
  await expect(page).toHaveURL(url);

  return { context, knownAdmin };
}
