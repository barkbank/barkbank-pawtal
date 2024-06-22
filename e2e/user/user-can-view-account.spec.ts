import { test, expect } from "@playwright/test";
import { gotoUserMyAccountPage } from "../_lib/ops/nav-gotos";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doLoginKnownUser } from "../_lib/ops/do-login-known-user";

test("user can view their account", async ({ page }) => {
  const context = await initPomContext({ page });
  const knownUser = await doLoginKnownUser(context);
  const accountPage = await gotoUserMyAccountPage({ context });
  const { userName, userEmail, userPhoneNumber, userResidency } = knownUser;
  await expect(accountPage.exactText(userName)).toBeVisible();
  await expect(accountPage.exactText(userEmail)).toBeVisible();
  await expect(accountPage.exactText(userPhoneNumber)).toBeVisible();
  await expect(accountPage.exactText(userResidency)).toBeVisible();
});
