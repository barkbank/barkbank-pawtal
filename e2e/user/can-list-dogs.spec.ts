import { test, expect } from "@playwright/test";
import { loginKnownUser } from "../_lib/pom/init";

test("user can list their dogs", async ({ page }) => {
  const {knownUser, petsPage} = await loginKnownUser(page);
  for (const dog of knownUser.userDogs) {
    const { dogName, dogStatus } = dog;
    const card = petsPage.dogCardItem(dogName);
    await expect(card.locator()).toBeVisible();
    await expect(
      card.locator().getByText(dogStatus, { exact: true }),
    ).toBeVisible();
  }
});
