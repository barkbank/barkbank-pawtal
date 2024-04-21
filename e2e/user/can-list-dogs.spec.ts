import { test, expect } from "@playwright/test";
import { getLocalhostWebsite, urlOf } from "../_lib/e2e-test-utils";
import { UserLogin, UserLoginPage } from "../_lib/pom/user-login-page";
import { UI_USER } from "../_lib/login-test-account";
import { MyPets } from "../_lib/pom/user-my-pets-page";

test("user can list their dogs", async ({ page }) => {
  const pawtal = getLocalhostWebsite();
  const userLoginPage = new UserLoginPage({ page, pawtal });
  await page.goto(pawtal.urlOf("/"));
  const myPetsPage = await userLoginPage.login(UI_USER.USER_EMAIL);
  await expect(myPetsPage.locateDog(UI_USER.ELIGIBLE_DOG_NAME)).toBeVisible();
  await expect(
    myPetsPage.locateDog(UI_USER.PERMANENTLY_INELIGIBLE_DOG_NAME),
  ).toBeVisible();
  await expect(
    myPetsPage.locateDog(UI_USER.TEMPORARILY_INELIGIBLE_DOG_NAME),
  ).toBeVisible();
});

test("second user can list their dogs", async ({ page }) => {
  await page.goto(urlOf("/"));
  await expect(page).toHaveURL(UserLogin(page).url);
  await UserLogin(page).emailField.fill("test_user@user.com");
  await UserLogin(page).otpField.fill("000000");
  await UserLogin(page).loginButton.click();
  await expect(page).toHaveURL(MyPets(page).url);
  await expect(page.getByText("Bentley", { exact: true })).toBeVisible();
  await expect(page.getByText("Mape", { exact: true })).toBeVisible();
  await expect(page.getByText("Ridley", { exact: true })).toBeVisible();
  await expect(page.getByText("Perry", { exact: true })).toBeVisible();
  await expect(MyPets(page).dog("Mape")).toBeVisible();
});
