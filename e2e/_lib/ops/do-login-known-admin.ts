import { expect } from "@playwright/test";
import { PomContext } from "../pom/core/pom-object";
import { FooterComponent } from "../pom/layout/footer-component";
import { RoutePath } from "@/lib/route-path";
import { getKnownAdmin } from "../utils/get-known-admin";
import { AdminLoginPage } from "../pom/pages/admin-login-page";
import { KnownAdmin } from "../models/known-admin";

export async function doLoginKnownAdmin(context: PomContext): Promise<{
  knownAdmin: KnownAdmin;
}> {
  const knownAdmin = getKnownAdmin();
  const footer = new FooterComponent(context);
  await footer.adminLoginLink().click();

  const pg = new AdminLoginPage(context);
  await pg.checkReady();
  await pg.emailField().fill(knownAdmin.adminEmail);
  await pg.otpField().fill("000000");
  await pg.loginButton().click();
  const url = context.website.urlOf(RoutePath.ADMIN_DEFAULT_LOGGED_IN_PAGE);
  await expect(context.page).toHaveURL(url);

  return { knownAdmin };
}
