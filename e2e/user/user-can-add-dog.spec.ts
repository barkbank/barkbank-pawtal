import { test, expect } from "@playwright/test";
import { getTestBirthday } from "../_lib/utils/get-test-birthday";
import { UserAddDogPage } from "../_lib/pom/pages/user-add-dog-page";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";
import { ToastComponent } from "../_lib/pom/layout/toast-component";
import { generateDog } from "../_lib/utils/generate-dog";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doRegister } from "../_lib/ops/do-register";

test("user can register, login, add dog, and see it in my-pets", async ({
  page,
}) => {
  // GIVEN
  const context = await initPomContext({ page });
  await doRegister(context);

  const pg1 = new UserMyPetsPage(context);
  await pg1.checkReady();
  await pg1.addPetButton().click();
  const pg2 = new UserAddDogPage(context);
  await pg2.checkReady();

  // WHEN dog details are filled in and saved
  const dogGender = "FEMALE";
  const { dogName, dogBreed } = generateDog({ dogGender });
  const dogBirthday = getTestBirthday(3);
  console.log("Generated Dog Details", { dogName, dogBirthday });
  await pg2.dogNameField().fill(dogName);
  await pg2.dogBreedField().fill(dogBreed);
  await pg2.dogBirthdayField().fill(dogBirthday);
  await pg2.dogWeightField().fill("25");
  await pg2.dogGenderOption_FEMALE().click();
  await expect(pg2.dogBloodTypeOption_UNKNOWN()).toBeVisible();
  await pg2.dogBloodTypeOption_UNKNOWN().click();
  await pg2.dogEverReceivedTransfusionOption_NO().click();
  await pg2.dogEverPregnantOption_NO().click();
  await pg2.dogPreferredVetOption_1().click();
  await pg2.saveButton().click();

  const toast = new ToastComponent(context);
  await expect(toast.locator()).toBeVisible();
  await expect(
    toast.locator().getByText("Adding...", { exact: true }),
  ).toBeVisible();
  await expect(
    toast.locator().getByText("Added!", { exact: true }),
  ).toBeVisible();
  await toast.closeButton().click();
  await expect(
    toast.locator().getByText("Added!", { exact: true }),
  ).not.toBeVisible();

  // THEN
  const pg3 = new UserMyPetsPage(context);
  await pg3.checkReady();
  const card = pg3.dogCardItem(dogName);
  await expect(card.locator()).toBeVisible();
  await expect(card.exactText("Eligible")).toBeVisible();
});
