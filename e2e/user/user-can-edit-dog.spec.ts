import { test, expect } from "@playwright/test";
import { registerTestUser } from "../_lib/pom/init/register-test-user";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";
import { UserEditDogPage } from "../_lib/pom/pages/user-edit-dog-page";

test("user can edit dog profile", async ({ page }) => {
  const { context, dogName, dogBreed, dogBirthday, dogWeightKg } =
    await registerTestUser({ page });

  const pg1 = new UserMyPetsPage(context);
  await pg1.checkUrl();

  const card1 = pg1.dogCardItem(dogName);
  await expect(card1.locator()).toBeVisible();
  await expect(card1.editButton()).toBeVisible();
  await card1.editButton().click();

  const pg2 = new UserEditDogPage(context);
  await pg2.checkUrl();
  await expect(pg2.dogNameField()).toHaveValue(dogName);
  await expect(pg2.dogBreedField()).toHaveValue(dogBreed);
  await expect(pg2.dogBirthdayField()).toHaveValue(dogBirthday);
  await expect(pg2.dogWeightField()).toHaveValue(dogWeightKg);
  await expect(pg2.saveButton()).toBeVisible();
  await pg2.dogNameField().fill("Thomas Green");
  await pg2.dogBreedField().fill("Royal Canine");
  await pg2.dogBirthdayField().fill("1968-08-28");
  await pg2.dogWeightField().fill("16.827");
  await pg2.saveButton().click();

  const pg3 = new UserMyPetsPage(context);
  await pg3.checkUrl();
  const card3 = pg3.dogCardItem("Thomas Green");
  await expect(card3.locator()).toBeVisible();
  await expect(card3.editButton()).toBeVisible();
  await card3.editButton().click();

  const pg4 = new UserEditDogPage(context);
  await pg4.checkUrl();
  await expect(pg4.dogNameField()).toHaveValue("Thomas Green");
  await expect(pg2.dogBreedField()).toHaveValue("Royal Canine");
  await expect(pg2.dogBirthdayField()).toHaveValue("1968-08-28");
  await expect(pg2.dogWeightField()).toHaveValue("16.827");
});
