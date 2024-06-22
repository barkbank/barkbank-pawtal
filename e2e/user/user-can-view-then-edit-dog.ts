import { test } from "@playwright/test";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";
import { UserEditDogPage } from "../_lib/pom/pages/user-edit-dog-page";
import { UserViewDogPage } from "../_lib/pom/pages/user-view-dog-page";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doLoginKnownUser } from "../_lib/ops/do-login-known-user";

test("user can list, view, edit, cancel, edit, submit, back, list", async ({
  page,
}) => {
  const context = await initPomContext({ page });
  const knownUser = await doLoginKnownUser(context);
  const { dogName } = knownUser.userDogs[0];

  const myPetsPage = new UserMyPetsPage(context);
  const editDogPage = new UserEditDogPage(context);
  const viewDogPage = new UserViewDogPage(context);

  await myPetsPage.checkUrl();
  await myPetsPage.dogCardItem(dogName).locator().click();

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
