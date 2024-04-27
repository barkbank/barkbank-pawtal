import { test, expect } from "@playwright/test";
import { registerTestUser } from "../_lib/pom/init/register-test-user";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";
import { UserEditDogPage } from "../_lib/pom/pages/user-edit-dog-page";

test("user can edit dog profile", async ({ page }) => {
  const { context, dogName, dogBreed } = await registerTestUser({ page });

  const pg1 = new UserMyPetsPage(context);
  await pg1.checkUrl();

  const card = pg1.dogCardItem(dogName);
  expect(card.locator()).toBeVisible();
  expect(card.editButton()).toBeVisible();
  await card.editButton().click();

  const pg2 = new UserEditDogPage(context);
  await pg2.checkUrl();
});
