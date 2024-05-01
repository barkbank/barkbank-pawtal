import { test, expect } from "@playwright/test";
import { registerTestUser } from "../_lib/init/register-test-user";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";
import { UserViewDogPage } from "../_lib/pom/pages/user-view-dog-page";

test("user can view dog", async ({ page }) => {
  const { context, dogName } = await registerTestUser({ page });

  const pg1 = new UserMyPetsPage(context);
  await pg1.checkUrl();
  await pg1.dogCardItem(dogName).viewButton().click();

  const pg2 = new UserViewDogPage(context);
  await pg2.checkUrl();
});
