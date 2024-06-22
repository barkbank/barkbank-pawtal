import { test, expect } from "@playwright/test";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doLoginKnownUser } from "../_lib/ops/do-login-known-user";

test("user can list their dogs", async ({ page }) => {
  const context = await initPomContext({ page });
  const knownUser = await doLoginKnownUser(context);
  const pgMyPets = new UserMyPetsPage(context);

  for (const dog of knownUser.userDogs) {
    const { dogName, dogStatus, vetName } = dog;
    const card = pgMyPets.dogCardItem(dogName);
    await expect(card.locator()).toBeVisible();
    await expect(card.exactText(dogStatus)).toBeVisible();
    if (vetName !== undefined) {
      await expect(card.locator().getByText(vetName)).toBeVisible();
    }
  }
});
