import {
  GeneratedRegistration,
  GeneratedRegistrationSchema,
} from "../models/generated-registration";
import { PomContext } from "../pom/core/pom-object";
import { UserMyPetsPage } from "../pom/pages/user-my-pets-page";
import { UserRegistrationPage } from "../pom/pages/user-registration-page";
import { pickOne } from "../utils/pick-one";
import { generateDog } from "../utils/generate-dog";
import { generateUser } from "../utils/generate-user";

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

  const { dogName, dogBreed, dogBirthday, dogWeightKg, ageYears } = dog;
  const { userName, userEmail, userPhoneNumber } = user;

  const pgReg = new UserRegistrationPage(context);
  const pgMyPets = new UserMyPetsPage(context);

  await context.page.goto(pgReg.url());
  await pgReg.checkReady();

  // Pet Form
  await pgReg.dogNameField().fill(dogName);
  await pgReg.dogBreedField().fill(dogBreed);
  await pgReg.dogBirthdayField().fill(dogBirthday);
  await pgReg.dogWeightField().fill(dogWeightKg);

  if (isIncomplete === true) {
    // Create profile that is incomplete
    await pgReg.dogGender_FEMALE().click();
    await pgReg.dogBloodType_UNKNOWN().click();
    await pgReg.dogEverReceivedTransfusion_UNKNOWN().click();
    await pgReg.dogEverPregnant_UNKNOWN().click();
  } else {
    if (dogGender === "MALE") {
      await pgReg.dogGender_MALE().click();
    } else {
      await pgReg.dogGender_FEMALE().click();
    }
    await pgReg.dogBloodType_UNKNOWN().click();
    await pgReg.dogEverReceivedTransfusion_NO().click();
    await pgReg.dogEverPregnant_NO().click();
  }

  if (withoutPreferredVet === true) {
    await pgReg.dogPreferredVet_None().click();
  } else {
    await pgReg.dogPreferredVet_VetClinic1().click();
  }
  await pgReg.nextButton().click();

  // Human Form
  await pgReg.userResidency_SINGAPORE().click();
  await pgReg.userNameField().fill(userName);
  await pgReg.userPhoneNumberField().fill(userPhoneNumber);
  await pgReg.userEmailField().fill(userEmail);
  await pgReg.otpField().fill("000000");
  await pgReg.disclaimerCheckbox().click();
  await pgReg.submitButton().click();

  // Final
  await pgReg.enterDashboardButton().click();

  // Should be at my pets
  await pgMyPets.checkReady();

  const reg: GeneratedRegistration = { dog, user };
  console.debug(reg);
  return GeneratedRegistrationSchema.parse(reg);
}
