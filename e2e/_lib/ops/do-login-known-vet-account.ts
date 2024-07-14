import { expect } from "@playwright/test";
import { PomContext } from "../pom/core/pom-object";
import { VetLoginPage } from "../pom/pages/vet-login-page";
import { FooterComponent } from "../pom/layout/footer-component";
import { RoutePath } from "@/lib/route-path";
import { getKnownVetAccount } from "../utils/get-known-vet-account";
import { KnownVetAccount } from "../models/known-vet-account";

export async function doLoginKnownVetAccount(context: PomContext): Promise<{
  knownVetAccount: KnownVetAccount;
}> {
  const knownVetAccount = getKnownVetAccount();
  const footer = new FooterComponent(context);
  await footer.vetLoginLink().click();

  const pg = new VetLoginPage(context);
  await pg.checkReady();
  await pg.emailField().fill(knownVetAccount.vetAccountEmail);
  await pg.otpField().fill("000000");
  await pg.loginButton().click();
  const url = context.website.urlOf(RoutePath.VET_DEFAULT_LOGGED_IN_PAGE);
  await expect(context.page).toHaveURL(url);

  return { knownVetAccount };
}
