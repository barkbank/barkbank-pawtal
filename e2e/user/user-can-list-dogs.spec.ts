import { test, expect } from "@playwright/test";
import { loginKnownUser } from "../_lib/init/login-known-user";

test("user can list their dogs", async ({ page }) => {
  const { knownUser, pomPage: petsPage } = await loginKnownUser({ page });
  for (const dog of knownUser.userDogs) {
    const { dogName, dogStatus, vetName } = dog;
    const card = petsPage.dogCardItem(dogName);
    await expect(card.locator()).toBeVisible();
    await expect(card.exactText(dogStatus)).toBeVisible();
    if (vetName !== undefined) {
      await expect(card.locator().getByText(vetName)).toBeVisible();
    }
  }
});
