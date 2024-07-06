import { test, expect } from "@playwright/test";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";
import { UserEditDogPage } from "../_lib/pom/pages/user-edit-dog-page";
import { UserViewDogPage } from "../_lib/pom/pages/user-view-dog-page";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doRegister } from "../_lib/ops/do-register";

test("user can cancel edit dog profile", async ({ page }) => {
  const context = await initPomContext({ page });
  const {
    dog: { dogName, dogBreed, dogBirthday, dogWeightKg },
  } = await doRegister(context);

  const pgList = new UserMyPetsPage(context);
  const pgView = new UserViewDogPage(context);
  const pgEdit = new UserEditDogPage(context);

  // Navigate to edit dog page
  await pgList.checkReady();
  await pgList.dogCardItem(dogName).locator().click();
  await pgView.editButton().click();
  await pgEdit.checkUrl();

  // Fill in form
  await expect(pgEdit.dogNameField()).toHaveValue(dogName);
  await expect(pgEdit.dogBreedField()).toHaveValue(dogBreed);
  await expect(pgEdit.dogBirthdayField()).toHaveValue(dogBirthday);
  await expect(pgEdit.dogWeightField()).toHaveValue(dogWeightKg);
  await pgEdit.dogNameField().fill("Thomas Green");
  await pgEdit.dogBreedField().fill("Royal Canine");
  await pgEdit.dogBirthdayField().fill("1968-08-28");
  await pgEdit.dogWeightField().fill("16.827");

  // Cancel
  await pgEdit.cancelButton().click();
  await pgView.checkUrl();

  // Navigate back to edit dog to verify no changes
  await pgView.editButton().click();
  await expect(pgEdit.dogNameField()).toHaveValue(dogName);
  await expect(pgEdit.dogBreedField()).toHaveValue(dogBreed);
  await expect(pgEdit.dogBirthdayField()).toHaveValue(dogBirthday);
  await expect(pgEdit.dogWeightField()).toHaveValue(dogWeightKg);
});
