import { test, expect } from "@playwright/test";
import { registerTestUser } from "../_lib/init/register-test-user";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";
import { UserEditDogPage } from "../_lib/pom/pages/user-edit-dog-page";
import { UserViewDogPage } from "../_lib/pom/pages/user-view-dog-page";

test("user can set weight to empty", async ({ page }) => {
  const { context, dogName } = await registerTestUser({ page });

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
  await pgEdit.dogWeightField().fill("");
  await pgEdit.saveButton().click();

  // Should be back at the view dog page.
  await pgView.checkUrl();

  // Go back to edit page to verify changes.
  await pgView.editButton().click();
  await pgEdit.checkUrl();
  await expect(pgEdit.dogWeightField()).toHaveValue("");
});
