import { test, expect } from "@playwright/test";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";
import { UserEditDogPage } from "../_lib/pom/pages/user-edit-dog-page";
import { UserViewDogPage } from "../_lib/pom/pages/user-view-dog-page";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doRegister } from "../_lib/ops/do-register";
import { ToastComponent } from "../_lib/pom/layout/toast-component";

test("user can set weight to empty", async ({ page }) => {
  const context = await initPomContext({ page });
  const {
    dog: { dogName },
  } = await doRegister(context);

  const pgList = new UserMyPetsPage(context);
  const pgView = new UserViewDogPage(context);
  const pgEdit = new UserEditDogPage(context);
  const toast = new ToastComponent(context);

  // Navigate to Edit Page
  await pgList.checkReady();
  await pgList.dogCardItem(dogName).locator().click();
  await pgView.checkReady();
  await pgView.editButton().click();
  await pgEdit.checkReady();

  // Fill in the Edit Dog form
  await pgEdit.checkReady();
  await pgEdit.dogWeightField().fill("");
  await pgEdit.saveButton().click();
  await expect(toast.locator()).toContainText("Saved");
  await toast.closeButton().click();

  // Should be back at the view dog page.
  await pgView.checkReady();

  // Go back to edit page to verify changes.
  await pgView.editButton().click();
  await pgEdit.checkReady();
  await expect(pgEdit.dogWeightField()).toHaveValue("");
});
