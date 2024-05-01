import { test, expect } from "@playwright/test";
import { loginKnownUser } from "../_lib/init/login-known-user";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";
import { UserMyAccountPage } from "../_lib/pom/pages/user-my-account-page";
import { UserMyAccountEditPage } from "../_lib/pom/pages/user-my-account-edit-page";
import { UserEditDogPage } from "../_lib/pom/pages/user-edit-dog-page";
import { UserViewDogPage } from "../_lib/pom/pages/user-view-dog-page";
import { NavComponent } from "../_lib/pom/layout/nav-component";

test("user navigation circuit", async ({ page }) => {
  const { context, knownUser } = await loginKnownUser({ page });
  const { dogName } = knownUser.userDogs[0];

  const myPetsPage = new UserMyPetsPage(context);
  const myAccountPage = new UserMyAccountPage(context);
  const editMyAccountPage = new UserMyAccountEditPage(context);
  const editDogPage = new UserEditDogPage(context);
  const viewDogPage = new UserViewDogPage(context);
  const nav = new NavComponent(context);

  await myPetsPage.checkUrl();
  await myPetsPage.dogCardItem(dogName).editButton().click();

  await editDogPage.checkUrl();
  await editDogPage.cancelButton().click();

  await myPetsPage.checkUrl();
  await myPetsPage.dogCardItem(dogName).viewButton().click();

  await viewDogPage.checkUrl();
  await viewDogPage.editButton().click();

  await editDogPage.checkUrl();
  await editDogPage.cancelButton().click();

  await viewDogPage.checkUrl();
  await viewDogPage.editButton().click();

  await editDogPage.checkUrl();
  await editDogPage.saveButton().click();

  await viewDogPage.checkUrl();
  await viewDogPage.backButton().click();

  await myPetsPage.checkUrl();
});
