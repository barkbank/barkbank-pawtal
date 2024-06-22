import { Page } from "@playwright/test";
import { initPomContext } from "./init-pom-context";
import { UserMyPetsPage } from "../pom/pages/user-my-pets-page";
import { PomContext } from "../pom/core/pom-object";
import { UserRegistrationPage } from "../pom/pages/user-registration-page";
import { generateDog } from "../utils/generate-dog";
import { GeneratedDog } from "../models/generated-dog";
import { generateUser } from "../utils/generate-user";
import { GeneratedUser } from "../models/generated-user";
import { pickOne } from "../utils/gen-utils";

export type RegisterTestUserType = {
  context: PomContext;
  userMyPetsPage: UserMyPetsPage;
} & GeneratedUser &
  GeneratedDog;

/**
 * @deprecated TODO: Use doRegister
 */
export async function registerTestUser(args: {
  page: Page;
  isIncomplete?: boolean;
}): Promise<RegisterTestUserType> {
  const { page, isIncomplete } = args;

  const dogGender = isIncomplete
    ? "FEMALE"
    : pickOne<"MALE" | "FEMALE">(["FEMALE", "MALE"]);
  const { dogName, dogBreed, dogBirthday, dogWeightKg, ageYears } = generateDog(
    {
      dogGender,
    },
  );
  const { userName, userEmail, userPhoneNumber } = generateUser();

  const context = await initPomContext({ page });

  const pg = new UserRegistrationPage(context);
  await page.goto(pg.url());
  await pg.checkUrl();

  // Pet Form
  await pg.dogNameField().fill(dogName);
  await pg.dogBreedField().fill(dogBreed);
  await pg.dogBirthdayField().fill(dogBirthday);
  await pg.dogWeightField().fill(dogWeightKg);

  if (isIncomplete === true) {
    // Create profile that is incomplete
    await pg.dogGender_FEMALE().click();
    await pg.dogBloodType_UNKNOWN().click();
    await pg.dogEverReceivedTransfusion_UNKNOWN().click();
    await pg.dogEverPregnant_UNKNOWN().click();
  } else {
    if (dogGender === "MALE") {
      await pg.dogGender_MALE().click();
    } else {
      await pg.dogGender_FEMALE().click();
    }
    await pg.dogBloodType_UNKNOWN().click();
    await pg.dogEverReceivedTransfusion_NO().click();
    await pg.dogEverPregnant_NO().click();
  }

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

  const result: RegisterTestUserType = {
    context,
    userMyPetsPage,

    userName,
    userEmail,
    userPhoneNumber,

    dogName,
    dogBreed,
    dogGender,
    dogBirthday,
    dogWeightKg,
    ageYears,
  };
  // console.log(result);
  return result;
}
