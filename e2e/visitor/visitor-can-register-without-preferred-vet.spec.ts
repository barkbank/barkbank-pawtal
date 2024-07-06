import { test, expect } from "@playwright/test";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doRegister } from "../_lib/ops/do-register";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";
import { UserViewDogPage } from "../_lib/pom/pages/user-view-dog-page";

test("visitor can register without a preferred vet", async ({ page }) => {
  const context = await initPomContext({ page });
  const pgPets = new UserMyPetsPage(context);
  const pgView = new UserViewDogPage(context);

  const {
    dog: { dogName },
  } = await doRegister(context, { withoutPreferredVet: true });
  await pgPets.checkReady();
  await pgPets.dogCardItem(dogName).locator().click();
  await pgView.checkReady();
  await expect(pgView.dogPreferredVetItem()).toContainText("No preferred vet");
});
