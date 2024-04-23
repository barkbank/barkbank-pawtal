import { test, expect } from "@playwright/test";
import { initLoginKnownUser } from "../_lib/pom/init";

test("user can list their dogs", async ({ page }) => {
  const { knownUser, pomPage: petsPage } = await initLoginKnownUser(page);
  for (const dog of knownUser.userDogs) {
    const { dogName, dogStatus } = dog;
    const card = petsPage.dogCardItem(dogName);
    await expect(card.locator()).toBeVisible();
    await expect(card.exactText(dogStatus)).toBeVisible();
  }
});
