import { test, expect } from "@playwright/test";
import { registerTestUser } from "../_lib/init/register-test-user";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";
import { UserEditDogPage } from "../_lib/pom/pages/user-edit-dog-page";
import { ToastComponent } from "../_lib/pom/layout/toast-component";
import { UserViewDogPage } from "../_lib/pom/pages/user-view-dog-page";
import { toUiWeightKg } from "../_lib/utils/to-ui-weight-kg";

test("user can edit dog profile", async ({ page }) => {
  const { context, dogName, dogBreed, dogBirthday, dogWeightKg } =
    await registerTestUser({ page });

  const pgList = new UserMyPetsPage(context);
  const pgView = new UserViewDogPage(context);
  const pgEdit = new UserEditDogPage(context);

  // Navigate to Edit Page
  await pgList.checkUrl();
  await pgList.dogCardItem(dogName).locator().click();
  await pgView.checkUrl();
  await pgView.editButton().click();
  await pgEdit.checkUrl();

  // Fill in the Edit Dog form
  await pgEdit.checkUrl();
  await expect(pgEdit.dogNameField()).toHaveValue(dogName);
  await expect(pgEdit.dogBreedField()).toHaveValue(dogBreed);
  await expect(pgEdit.dogBirthdayField()).toHaveValue(dogBirthday);
  await expect(pgEdit.dogWeightField()).toHaveValue(dogWeightKg);
  await expect(pgEdit.saveButton()).toBeVisible();
  await pgEdit.dogNameField().fill("Thomas Green");
  await pgEdit.dogBreedField().fill("Royal Canine");
  await pgEdit.dogBirthdayField().fill("1968-08-28");
  await pgEdit.dogWeightField().fill("16.827");
  await pgEdit.saveButton().click();

  // There should be a toast
  const toast = new ToastComponent(context);
  await expect(toast.locator()).toBeVisible();
  await expect(
    toast.locator().getByText("Saving...", { exact: true }),
  ).toBeVisible();
  await expect(
    toast.locator().getByText("Saved!", { exact: true }),
  ).toBeVisible();
  await toast.closeButton().click();
  await expect(
    toast.locator().getByText("Saved!", { exact: true }),
  ).not.toBeVisible();

  // Should be back at the view dog page.
  await pgView.checkUrl();

  // Go back to edit page to verify changes.
  await pgView.editButton().click();
  await pgEdit.checkUrl();
  await expect(pgEdit.dogNameField()).toHaveValue("Thomas Green");
  await expect(pgEdit.dogBreedField()).toHaveValue("Royal Canine");
  await expect(pgEdit.dogBirthdayField()).toHaveValue("28 Aug 1968");
  await expect(pgEdit.dogWeightField()).toHaveValue("16.827");
});
