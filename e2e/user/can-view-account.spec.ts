import { test, expect } from "@playwright/test";
import { loginKnownUser } from "../_lib/pom/init";

test("user can view their account", async ({page}) => {
  const {knownUser, petsPage} = await loginKnownUser(page);
  const accountPage = await petsPage.sidebar().clickMyAccount()
  const {userName, userEmail, userPhoneNumber, userResidency} = knownUser
  await expect(accountPage.page().getByText(userName, {exact: true})).toBeVisible();
  await expect(accountPage.page().getByText(userEmail, {exact: true})).toBeVisible();
  await expect(accountPage.page().getByText(userPhoneNumber, {exact: true})).toBeVisible();
  await expect(accountPage.page().getByText(userResidency, {exact: true})).toBeVisible();
})
