import { test, expect } from "@playwright/test";
import { initPomContext } from "../_lib/init/init-pom-context";
import { UserLoginPage } from "../_lib/pom/pages/user-login-page";
import { UserRegistrationPage } from "../_lib/pom/pages/user-registration-page";
import { getTestBirthday } from "../_lib/utils/get-test-birthday";
import { generateRandomGUID } from "@/lib/utilities/bark-guid";
import { NavComponent } from "../_lib/pom/layout/nav-component";
import { UserMyAccountPage } from "../_lib/pom/pages/user-my-account-page";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";

test("visitor can register a new user account", async ({ page }) => {
  // Navigating to the registration form
  const context = await initPomContext({ page });
  const pg1 = new UserLoginPage(context);
  await pg1.checkUrl();
  await pg1.registerLink().click();

  // Fill in the dog form
  const pg2 = new UserRegistrationPage(context);
  await pg2.checkUrl();
  await expect(pg2.dogFormHeader()).toBeVisible();
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

  // Fill in the owner form
  await expect(pg2.ownerFormHeader()).toBeVisible();
  await pg2.userResidency_SINGAPORE().click();
  await pg2.userNameField().fill("Ian Little");
  await pg2.userPhoneNumberField().fill("87654321");
  const guid = generateRandomGUID(8);
  const userEmail = `ian.${guid}@user.com`;
  await pg2.userEmailField().fill(userEmail);

  // Go back to the dog form and back to the owner form. This checks if the data
  // entered for dog and owner are preserved.
  await pg2.backButton().click();
  await expect(pg2.dogFormHeader()).toBeVisible();
  await pg2.nextButton().click();
  await expect(pg2.ownerFormHeader()).toBeVisible();

  // Request OTP and submit
  await pg2.sendOtpButton().click();
  await pg2.otpField().fill("000000");
  await pg2.disclaimerCheckbox().click();
  await pg2.submitButton().click();

  // Registered page. Click enter dashboard button.
  await expect(pg2.accountCreatedMessage()).toBeVisible();
  await expect(pg2.enterDashboardButton()).toBeVisible();
  await pg2.enterDashboardButton().click();

  // Check for expected dog in my pets
  const pg3 = new UserMyPetsPage(context);
  await pg3.checkUrl();
  await expect(pg3.dogCardItem("Casper").locator()).toBeVisible();

  // Navigate to my account page
  const nav = new NavComponent(context);
  await expect(nav.locator()).toBeVisible();
  await nav.myAcountOption().click();

  // Check for account details
  const pg4 = new UserMyAccountPage(context);
  await pg4.checkUrl();
  await expect(pg4.exactText("Ian Little")).toBeVisible();
  await expect(pg4.exactText("87654321")).toBeVisible();
  await expect(pg4.exactText(userEmail)).toBeVisible();
});
