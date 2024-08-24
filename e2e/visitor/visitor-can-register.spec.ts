import { test, expect } from "@playwright/test";
import { initPomContext } from "../_lib/init/init-pom-context";
import { UserLoginPage } from "../_lib/pom/pages/user-login-page";
import { getTestBirthday } from "../_lib/utils/get-test-birthday";
import { generateRandomGUID } from "@/lib/utilities/bark-guid";
import { NavComponent } from "../_lib/pom/layout/nav-component";
import { UserMyAccountPage } from "../_lib/pom/pages/user-my-account-page";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";
import { UserRegistrationPetFormPage } from "../_lib/pom/pages/user-registration-pet-form-page";
import { UserRegistrationOwnerFormPage } from "../_lib/pom/pages/user-registration-owner-form-page";
import { UserRegistrationSuccessPage } from "../_lib/pom/pages/user-registration-success-page";
import { USER_TITLE } from "@/lib/bark/enums/user-title";
import { RoutePath } from "@/lib/route-path";

test("visitor can register a new user account", async ({ page }) => {
  // Navigating to the registration form
  const context = await initPomContext({ page });

  // Should be at the user login page after init. Click the register link to
  // start the registration process.
  const pgLogin = new UserLoginPage(context);
  await pgLogin.checkReady();
  await pgLogin.registerLink().click();

  // Should now be at the pet form. Fill in the pet form.
  const pgPetForm = new UserRegistrationPetFormPage(context, {
    routePath: RoutePath.USER_REGISTRATION_UTM_NEW_USER,
  });
  await pgPetForm.checkReady();
  await expect(pgPetForm.dogFormHeader()).toBeVisible();
  await pgPetForm.dogNameField().fill("Casper");
  await pgPetForm.dogBreedField().fill("White Sheet Dog");
  const dogBirthday = getTestBirthday(6);
  await pgPetForm.dogBirthdayField().fill(dogBirthday);
  await pgPetForm.dogWeightField().fill("42");
  await pgPetForm.dogGender_MALE().click();
  await pgPetForm.dogBloodType_UNKNOWN().click();
  if (await pgPetForm.dogEverPregnant_NO().isEnabled()) {
    await pgPetForm.dogEverPregnant_NO().click();
  }
  await pgPetForm.dogEverReceivedTransfusion_NO().click();
  await pgPetForm.dogPreferredVet_VetClinic1().click();
  await pgPetForm.nextButton().click();

  // Should now be at the owner form. Fill in the owner form.
  const pgOwnerForm = new UserRegistrationOwnerFormPage(context, {
    routePath: RoutePath.USER_REGISTRATION_UTM_NEW_USER,
  });
  await pgOwnerForm.checkReady();
  await expect(pgOwnerForm.ownerFormHeader()).toBeVisible();
  await pgOwnerForm.userResidency_SINGAPORE().click();
  await pgOwnerForm.userNameField().fill("Ian Little");
  await pgOwnerForm.userTitleSelection().click();
  await pgOwnerForm.userTitleOption({ userTitle: USER_TITLE.MR }).click();
  await pgOwnerForm.userPhoneNumberField().fill("87654321");
  const guid = generateRandomGUID(8);
  const userEmail = `ian.${guid}@user.com`;
  await pgOwnerForm.userEmailField().fill(userEmail);

  // Go back to the pet form and back to the owner form. This checks if the data
  // entered for pet and owner are preserved.
  await pgOwnerForm.backButton().click();
  await pgPetForm.checkReady();
  await pgPetForm.nextButton().click();
  await pgOwnerForm.checkReady();

  // Request OTP and submit
  await pgOwnerForm.sendOtpButton().click();
  await pgOwnerForm.otpField().fill("000000");
  await pgOwnerForm.disclaimerCheckbox().click();
  await pgOwnerForm.submitButton().click();

  // Should now be at the registration success page. Verify presence of expected
  // elements and click enter dashboard button.
  const pgRegSuccess = new UserRegistrationSuccessPage(context, {
    routePath: RoutePath.USER_REGISTRATION_UTM_NEW_USER,
  });
  await pgRegSuccess.checkReady();
  await expect(pgRegSuccess.upcomingBloodProfilingMessage()).toBeVisible();
  await expect(pgRegSuccess.accountCreatedMessage()).toBeVisible();
  await expect(pgRegSuccess.enterDashboardButton()).toBeVisible();
  await pgRegSuccess.enterDashboardButton().click();

  // Check for expected dog in my pets
  const pgMyPets = new UserMyPetsPage(context);
  await pgMyPets.checkReady();
  await expect(pgMyPets.dogCardItem("Casper").locator()).toBeVisible();

  // Navigate to my account page
  const nav = new NavComponent(context);
  await expect(nav.locator()).toBeVisible();
  await nav.myAcountOption().click();

  // Check for account details
  const pgMyAccount = new UserMyAccountPage(context);
  await pgMyAccount.checkReady();
  await expect(pgMyAccount.exactText("Mr Ian Little")).toBeVisible();
  await expect(pgMyAccount.residencyItem()).toHaveValue("Singapore");
  await expect(pgMyAccount.phoneNumberItem()).toHaveValue("87654321");
  await expect(pgMyAccount.emailItem()).toHaveValue(userEmail);
});
