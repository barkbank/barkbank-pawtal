import { Page, expect } from "@playwright/test";
import { PomContext } from "../pom/core/pom-object";
import { PomVet } from "../pom/entities";
import { initPomContext } from "./init-pom-context";
import { getKnownVet } from "../known-entities/known-vet";
import { VetLoginPage } from "../pom/pages/vet-login-page";
import { FooterComponent } from "../pom/layout/footer-component";
import { RoutePath } from "@/lib/route-path";

export async function loginKnownVet(args: { page: Page }): Promise<{
  context: PomContext;
  knownVet: PomVet;
}> {
  const { page } = args;
  const context = await initPomContext({ page });
  const knownVet = getKnownVet();
  const footer = new FooterComponent(context);
  await footer.vetLoginLink().click();

  const pg = new VetLoginPage(context);
  await pg.checkUrl();
  await pg.emailField().fill(knownVet.vetEmail);
  await pg.otpField().fill("000000");
  await pg.loginButton().click();
  const url = context.website.urlOf(RoutePath.VET_DEFAULT_LOGGED_IN_PAGE);
  await expect(page).toHaveURL(url);

  return { context, knownVet };
}
