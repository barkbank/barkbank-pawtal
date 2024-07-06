import { expect } from "@playwright/test";
import { PomContext } from "../pom/core/pom-object";
import { UserLoginPage } from "../pom/pages/user-login-page";
import { UserMyPetsPage } from "../pom/pages/user-my-pets-page";

/**
 * @param args.context Should be at the UserLoginPage.
 * @param args.userEmail User email.
 * @returns
 */
export async function doUserLoginSequence(
  context: PomContext,
  args: { userEmail: string },
): Promise<UserMyPetsPage> {
  const { userEmail } = args;

  const pg1 = new UserLoginPage(context);
  await pg1.checkReady();
  await pg1.emailField().fill(userEmail);
  await pg1.sendMeAnOtpButton().click();
  await expect(pg1.otpSentMessage()).toBeVisible();
  await pg1.otpField().fill("000000");
  await pg1.loginButton().click();

  const pg2 = new UserMyPetsPage(context);
  await pg2.checkReady();
  return pg2;
}
