import { test, expect } from "@playwright/test";
import { loginKnownUser, sidebarOf } from "../_lib/pom/init";

test("user can list their dogs", async ({ page }) => {
  const { knownUser, pomPage } = await loginKnownUser(page);
  const petsPage = await sidebarOf(pomPage).gotoMyPets();
  for (const dog of knownUser.userDogs) {
    const { dogName, dogStatus } = dog;
    const card = petsPage.dogCardItem(dogName);
    await expect(card.locator()).toBeVisible();
    await expect(card.exactText(dogStatus)).toBeVisible();
  }
});
