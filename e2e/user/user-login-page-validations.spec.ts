import { test, expect } from "@playwright/test";
import { initPomContext } from "../_lib/init/init-pom-context";
import { UserLoginPage } from "../_lib/pom/pages/user-login-page";
import { getKnownUser } from "../_lib/utils/get-known-user";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";

test("email cannot be empty when requesting an otp", async ({ page }) => {
  const context = await initPomContext({ page });
  const pg = new UserLoginPage(context);
  await pg.checkUrl();
  await pg.sendMeAnOtpButton().click();
  await expect(pg.invalidEmailErrorMessage()).toBeVisible();
});

test("email cannot be invalid when requesting an otp", async ({ page }) => {
  const context = await initPomContext({ page });
  const pg = new UserLoginPage(context);
  await pg.checkUrl();
  await pg.emailField().fill("invalid_email_value");
  await pg.sendMeAnOtpButton().click();
  await expect(pg.invalidEmailErrorMessage()).toBeVisible();
});

test("email must belong to an account when requesting an otp", async ({
  page,
}) => {
  const context = await initPomContext({ page });
  const pg = new UserLoginPage(context);
  await pg.checkUrl();
  await pg.emailField().fill("no_account@user.com");
  await pg.sendMeAnOtpButton().click();
  await expect(pg.userAccountDoesNotExistErrorMessage()).toBeVisible();
});

test("shows otp sent when requesting an otp for a valid email", async ({
  page,
}) => {
  const context = await initPomContext({ page });
  const pg = new UserLoginPage(context);
  await pg.checkUrl();
  const { userEmail } = getKnownUser();
  await pg.emailField().fill(userEmail);
  await pg.sendMeAnOtpButton().click();
  await expect(pg.otpSentMessage()).toBeVisible();
});

test("otp cannot be empty when login is clicked", async ({ page }) => {
  const context = await initPomContext({ page });
  const pg = new UserLoginPage(context);
  await pg.checkUrl();
  const { userEmail } = getKnownUser();
  await pg.emailField().fill(userEmail);
  await pg.sendMeAnOtpButton().click();
  await pg.loginButton().click();
  await expect(pg.otpCannotBeEmptyErrorMessage()).toBeVisible();
});
