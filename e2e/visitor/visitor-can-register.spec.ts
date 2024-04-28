import { test, expect } from "@playwright/test";
import { initPomContext } from "../_lib/pom/init/init-pom-context";
import { UserLoginPage } from "../_lib/pom/pages/user-login-page";
import { UserRegistrationPage } from "../_lib/pom/pages/user-registration-page";
import { getTestBirthday } from "../_lib/e2e-test-utils";
import { generateRandomGUID } from "@/lib/utilities/bark-guid";
import { NavComponent } from "../_lib/pom/layout/nav-component";
import { UserMyAccountPage } from "../_lib/pom/pages/user-my-account-page";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";

test("visitor can register a new user account", async ({ page }) => {
  const context = await initPomContext({ page });

  const pg1 = new UserLoginPage(context);
  await pg1.checkUrl();
  await pg1.registerLink().click();

  const pg2 = new UserRegistrationPage(context);
  await pg2.checkUrl();

  await expect(pg2.dogNameField()).toBeVisible();
  await pg2.dogNameField().fill("Casper");
  await pg2.dogBreedField().fill("White Sheet Dog");
  const dogBirthday = getTestBirthday(6);
  await pg2.dogBirthdayField().fill(dogBirthday);
  await pg2.dogWeightField().fill("42");
  await pg2.dogGender_MALE().click();
  await pg2.dogBloodType_UNKNOWN().click();
  await pg2.dogEverPregnant_NO().click();
  await pg2.dogEverReceivedTransfusion_NO().click();
  await pg2.dogPreferredVet_VetClinic1().click();
  await pg2.nextButton().click();

  await expect(pg2.userResidency_OTHER()).toBeVisible();
  await pg2.userResidency_SINGAPORE().click();
  await pg2.userNameField().fill("Ian Little");
  await pg2.userPhoneNumberField().fill("87654321");
  const guid = generateRandomGUID(8);
  const userEmail = `ian.${guid}@user.com`;
  await pg2.userEmailField().fill(userEmail);
  await pg2.sendOtpButton().click();
  await pg2.otpField().fill("000000");
  await pg2.disclaimerCheckbox().click();
  await pg2.submitButton().click();

  await expect(pg2.accountCreatedMessage()).toBeVisible();
  await expect(pg2.enterDashboardButton()).toBeVisible();
  await pg2.enterDashboardButton().click();

  const pg3 = new UserMyPetsPage(context);
  await pg3.checkUrl();
  await expect(pg3.dogCardItem("Casper").locator()).toBeVisible();

  const nav = new NavComponent(context);
  await expect(nav.locator()).toBeVisible();
  await nav.myAcountOption().click();

  const pg4 = new UserMyAccountPage(context);
  await pg4.checkUrl();

  await expect(pg4.exactText("Ian Little")).toBeVisible();
  await expect(pg4.exactText("87654321")).toBeVisible();
  await expect(pg4.exactText(userEmail)).toBeVisible();
});
