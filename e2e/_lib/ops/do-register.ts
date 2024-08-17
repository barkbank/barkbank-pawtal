import { expect } from "@playwright/test";
import {
  GeneratedRegistration,
  GeneratedRegistrationSchema,
} from "../models/generated-registration";
import { PomContext } from "../pom/core/pom-object";
import { UserMyPetsPage } from "../pom/pages/user-my-pets-page";
import { pickOne } from "../utils/pick-one";
import { generateDog } from "../utils/generate-dog";
import { generateUser } from "../utils/generate-user";
import { UserRegistrationPetFormPage } from "../pom/pages/user-registration-pet-form-page";
import { UserRegistrationOwnerFormPage } from "../pom/pages/user-registration-owner-form-page";
import { UserRegistrationSuccessPage } from "../pom/pages/user-registration-success-page";

export async function doRegister(
  context: PomContext,
  args?: { isIncomplete?: boolean; withoutPreferredVet?: boolean },
): Promise<GeneratedRegistration> {
  const { isIncomplete, withoutPreferredVet } = args ?? {};

  const dogGender =
    isIncomplete === true
      ? "FEMALE"
      : pickOne<"MALE" | "FEMALE">(["FEMALE", "MALE"]);
  const dog = generateDog({ dogGender });
  const user = generateUser();

  const { dogName, dogBreed, dogBirthday, dogWeightKg } = dog;
  const { userName, userEmail, userPhoneNumber } = user;

  const pgPetForm = new UserRegistrationPetFormPage(context);
  const pgOwnerForm = new UserRegistrationOwnerFormPage(context);
  const pgRegSuccess = new UserRegistrationSuccessPage(context);
  const pgMyPets = new UserMyPetsPage(context);

  // Start at pet form
  await context.page.goto(pgPetForm.url());
  await pgPetForm.checkReady();

  // Pet Form
  await pgPetForm.checkReady();
  await pgPetForm.dogNameField().fill(dogName);
  await pgPetForm.dogBreedField().fill(dogBreed);
  await pgPetForm.dogBirthdayField().fill(dogBirthday);
  await pgPetForm.dogWeightField().fill(dogWeightKg);

  if (isIncomplete === true) {
    // Create profile that is incomplete
    await pgPetForm.dogGender_FEMALE().click();
    await pgPetForm.dogBloodType_UNKNOWN().click();
    await pgPetForm.dogEverReceivedTransfusion_UNKNOWN().click();
    await pgPetForm.dogEverPregnant_UNKNOWN().click();
  } else {
    if (dogGender === "MALE") {
      await pgPetForm.dogGender_MALE().click();
    } else {
      await pgPetForm.dogGender_FEMALE().click();
    }
    await pgPetForm.dogBloodType_UNKNOWN().click();
    await pgPetForm.dogEverReceivedTransfusion_NO().click();
    if (await pgPetForm.dogEverPregnant_NO().isEnabled()) {
      await pgPetForm.dogEverPregnant_NO().click();
    }
  }

  if (withoutPreferredVet === true) {
    await pgPetForm.dogPreferredVet_None().click();
  } else {
    await pgPetForm.dogPreferredVet_VetClinic1().click();
  }
  await pgPetForm.nextButton().click();

  // Owner Form
  await pgOwnerForm.checkReady();
  await pgOwnerForm.userResidency_SINGAPORE().click();
  await pgOwnerForm.userNameField().fill(userName);
  await pgOwnerForm.userPhoneNumberField().fill(userPhoneNumber);
  await pgOwnerForm.userEmailField().fill(userEmail);
  await pgOwnerForm.sendOtpButton().click();
  await pgOwnerForm.otpField().fill("000000");
  await pgOwnerForm.disclaimerCheckbox().click();
  await pgOwnerForm.submitButton().click();

  // BARK-89: Only mention that a vet will reach out when a preferred vet has been selected
  await pgRegSuccess.checkReady();
  if (withoutPreferredVet === true) {
    await expect(
      pgRegSuccess.upcomingBloodProfilingMessage(),
    ).not.toBeVisible();
  } else {
    await expect(pgRegSuccess.upcomingBloodProfilingMessage()).toBeVisible();
  }

  // Final
  await pgRegSuccess.enterDashboardButton().click();

  // Should be at my pets
  await pgMyPets.checkReady();

  const reg: GeneratedRegistration = { dog, user };
  console.debug(reg);
  return GeneratedRegistrationSchema.parse(reg);
}
