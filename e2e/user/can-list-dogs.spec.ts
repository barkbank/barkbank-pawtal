import { test, expect } from "@playwright/test";
import { UserLoginPage } from "../_lib/pom/user-login-page";
import { initPomContext } from "../_lib/pom/init";
import { getKnownUser } from "../_lib/pom/known-user";

test("user can list their dogs", async ({ page }) => {
  const ctx = await initPomContext(page);
  const usr = getKnownUser();

  const loginPage = new UserLoginPage(ctx);
  const petsPage = await loginPage.doLogin(usr.userEmail);

  for (const dog of usr.userDogs) {
    const { dogName, dogStatus } = dog;
    const card = petsPage.dogCardItem(dogName);
    await expect(card.locator()).toBeVisible();
    await expect(
      card.locator().getByText(dogStatus, { exact: true }),
    ).toBeVisible();
  }
});
