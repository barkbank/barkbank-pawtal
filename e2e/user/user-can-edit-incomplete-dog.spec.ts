import { test, expect } from "@playwright/test";
import { registerTestUser } from "../_lib/init/register-test-user";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";
import { UserEditDogPage } from "../_lib/pom/pages/user-edit-dog-page";

test("user can edit incomplete dog profile", async ({ page }) => {
  const { context, dogName, dogBreed, dogBirthday, dogWeightKg } =
    await registerTestUser({ page, isIncomplete: true });

  // Should be at the my pets page at the beginning.
  const pg1 = new UserMyPetsPage(context);
  await pg1.checkUrl();

  // Clicking complete profile button should take user to the Edit Dog page.
  await expect(pg1.dogCardItem(dogName).completeProfileButton()).toBeVisible();
  await pg1.dogCardItem(dogName).completeProfileButton().click();
  const pg2 = new UserEditDogPage(context);
  await pg2.checkUrl();

  // Complete the profile by specifying transfusion and pregnancy history.
  await pg2.dogEverReceivedTransfusionOption_NO().click();
  await pg2.dogEverPregnantOption_NO().click();
  await pg2.saveButton().click();

  // Back at my-pets, the profile should now be complete
  const pg3 = new UserMyPetsPage(context);
  await pg3.checkUrl();
  await expect(pg3.dogCardItem(dogName).editButton()).toBeVisible();
  await expect(pg3.dogCardItem(dogName).viewButton()).toBeVisible();
  await expect(
    pg3.dogCardItem(dogName).completeProfileButton(),
  ).not.toBeVisible();
});
