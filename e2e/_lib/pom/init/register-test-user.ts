import { generateRandomGUID } from "@/lib/utilities/bark-guid";
import { Page } from "@playwright/test";
import { getTestBirthday } from "../../e2e-test-utils";
import { initPomContext } from "./init-pom-context";
import { UserMyPetsPage } from "../pages/user-my-pets-page";
import { PomContext } from "../core/pom-object";
import { UserRegistrationPage } from "../pages/user-registration-page";

export async function registerTestUser(args: { page: Page }): Promise<{
  context: PomContext;
  guid: string;
  userName: string;
  userEmail: string;
  userPhoneNumber: string;
  dogName: string;
  dogBreed: string;
  dogBirthday: string;
  dogWeightKg: string;
  userMyPetsPage: UserMyPetsPage;
}> {
  const guid = generateRandomGUID(8);
  const userName = `Alice (${guid})`;
  const userEmail = `alice.${guid}@user.com`;
  const userPhoneNumber = guid;
  const dogName = `Bob (${guid})`;
  const dogBreed = "REGISTERED DOG";
  const dogBirthday = getTestBirthday(5);
  const dogWeightKg = "31.4";

  const { page } = args;
  const context = await initPomContext({ page });

  const pg = new UserRegistrationPage(context);
  await page.goto(pg.url());
  await pg.checkUrl();

  // Pet Form
  await pg.dogNameField().fill(dogName);
  await pg.dogBreedField().fill(dogBreed);
  await pg.dogBirthdayField().fill(dogBirthday);
  await pg.dogGender_MALE().click();
  await pg.dogWeightField().fill(dogWeightKg);
  await pg.dogBloodType_UNKNOWN().click();
  await pg.dogEverReceivedTransfusion_NO().click();
  await pg.dogEverPregnant_NO().click();
  await pg.dogPreferredVet_VetClinic1().click();
  await pg.nextButton().click();

  // Human Form
  await pg.userResidency_SINGAPORE().click();
  await pg.userNameField().fill(userName);
  await pg.userPhoneNumberField().fill(userPhoneNumber);
  await pg.userEmailField().fill(userEmail);
  await pg.otpField().fill("000000");
  await pg.disclaimerCheckbox().click();
  await pg.submitButton().click();

  // Final
  await pg.enterDashboardButton().click();

  // Should be at my pets
  const userMyPetsPage = new UserMyPetsPage(context);
  await userMyPetsPage.checkUrl();

  const result = {
    context,
    guid,
    userName,
    userEmail,
    userPhoneNumber,
    dogName,
    dogBreed,
    dogBirthday,
    dogWeightKg,
    userMyPetsPage,
  };
  console.log(result);
  return result;
}
