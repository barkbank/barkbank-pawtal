import { test, expect } from "@playwright/test";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";
import { UserEditDogPage } from "../_lib/pom/pages/user-edit-dog-page";
import { UserViewDogPage } from "../_lib/pom/pages/user-view-dog-page";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doRegister } from "../_lib/ops/do-register";
import { ToastComponent } from "../_lib/pom/layout/toast-component";

test("user can edit incomplete dog profile", async ({ page }) => {
  const context = await initPomContext({ page });
  const {
    dog: { dogName },
  } = await doRegister(context, { isIncomplete: true });

  const pgList = new UserMyPetsPage(context);
  const pgView = new UserViewDogPage(context);
  const pgEdit = new UserEditDogPage(context);
  const toast = new ToastComponent(context);

  // Starting at the dog list page, user should see that their dog's profile is
  // incomplete.
  await pgList.checkUrl();
  await expect(
    pgList.dogCardItem(dogName).profileIncompleteStatusText(),
  ).toBeVisible();

  // Navigate to edit dog form
  await pgList.checkUrl();
  await pgList.dogCardItem(dogName).locator().click();
  await pgView.editButton().click();
  await pgEdit.checkUrl();

  // Complete the profile
  await pgEdit.dogEverReceivedTransfusionOption_NO().click();
  await pgEdit.dogEverPregnantOption_NO().click();
  await pgEdit.saveButton().click();
  await expect(toast.locator()).toContainText("Saved");
  await toast.closeButton().click();

  // Navigate back to list
  await pgView.checkUrl();
  await pgView.backButton().click();
  await pgList.checkUrl();

  // Verify status is updated
  await expect(
    pgList.dogCardItem(dogName).profileIncompleteStatusText(),
  ).not.toBeVisible();
  await expect(
    pgList.dogCardItem(dogName).profileEligibleStatusText(),
  ).toBeVisible();
});
