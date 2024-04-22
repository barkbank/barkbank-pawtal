import { test, expect } from "@playwright/test";
import { registerTestUser } from "./_lib/pom/sequences/register-test-user";
import { getTestBirthday } from "./_lib/e2e-test-utils";
import { generateTestDogName } from "./_lib/e2e-test-utils";
import { urlOf } from "./_lib/e2e-test-utils";
import { RoutePath } from "@/lib/route-path";

test("user can register, login, add dog but cancel, and not should not see new dog in my-pets", async ({
  page,
}) => {
  // GIVEN login
  const { userEmail } = await registerTestUser({ page });
  console.log({ userEmail });
  await page.goto(urlOf(RoutePath.USER_MY_PETS));
  await page.waitForURL(urlOf(RoutePath.USER_MY_PETS));

  // WHEN Add Pet is clicked, THEN expect to be routed to Add Dog page.
  await page.getByRole("link", { name: "Add Pet" }).click();
  await expect(page).toHaveURL(urlOf(RoutePath.USER_ADD_DOG));

  // WHEN dog details are filled in
  const dogName = generateTestDogName();
  console.log({ dogName });
  await page.getByLabel("Name").fill(dogName);
  await page.getByLabel("Breed").fill("UI_TEST_DOG");
  await page.locator('input[name="dogBirthday"]').fill(getTestBirthday(3));
  await page.getByLabel("Weight").fill("25");

  // WITH gender: Male
  await page
    .getByText("SexMaleFemale")
    .getByLabel("Male", { exact: true })
    .click();

  // WITH blood type: I don't know
  await page
    .getByText("Blood TypeI don't knowD.E.A 1")
    .locator('[id="\\:rb\\:-form-item"]')
    .click();

  // WITH ever received transfusion: No
  await page
    .getByText("Ever Received Blood TransfusionI don't knowYesNo")
    .locator('[id="\\:ri\\:-form-item"]')
    .click();

  // WITH ever pregnant: No
  await page
    .getByText("Ever PregnantI don't knowYesNo")
    .locator('[id="\\:rt\\:-form-item"]')
    .click();

  // WITH preferred vet: Vet 1
  await page
    .getByText("Preferred Donation PointVet")
    .getByLabel("Vet Clinic 1")
    .click();

  // AND Cancel is clicked
  await page.getByRole("button", { name: "Cancel" }).click();

  // THEN expect to be routed to My Pets page.
  await expect(page).toHaveURL(urlOf(RoutePath.USER_MY_PETS));

  // AND expect new dog NOT to be in the list.
  await expect(page.getByText(dogName)).not.toBeVisible();
});
