import { expect } from "@playwright/test";
import { PomContext } from "../pom/core/pom-object";
import { getKnownVet } from "../utils/get-known-vet";
import { VetLoginPage } from "../pom/pages/vet-login-page";
import { FooterComponent } from "../pom/layout/footer-component";
import { RoutePath } from "@/lib/route-path";
import { KnownVet } from "../models/known-vet";

export async function doLoginKnownVet(context: PomContext): Promise<{
  knownVet: KnownVet;
}> {
  const knownVet = getKnownVet();
  const footer = new FooterComponent(context);
  await footer.vetLoginLink().click();

  const pg = new VetLoginPage(context);
  await pg.checkReady();
  await pg.emailField().fill(knownVet.vetEmail);
  await pg.otpField().fill("000000");
  await pg.loginButton().click();
  const url = context.website.urlOf(RoutePath.VET_DEFAULT_LOGGED_IN_PAGE);
  await expect(context.page).toHaveURL(url);

  return { knownVet };
}
