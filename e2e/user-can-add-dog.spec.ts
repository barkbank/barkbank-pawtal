import { test, expect } from "@playwright/test";
import { loginTestUser, urlOf } from "./_ui_test_helpers";
import { RoutePath } from "@/lib/route-path";
import { SINGAPORE_TIME_ZONE, formatDateTime } from "@/lib/utilities/bark-time";
import { sprintf } from "sprintf-js";

test("user can login, add dog, and see it in my-pets", async ({ page }) => {
  // GIVEN login
  await loginTestUser({ page });
  await page.goto(urlOf(RoutePath.USER_MY_PETS));
  await page.waitForURL(urlOf(RoutePath.USER_MY_PETS));

  // WHEN Add Pet is clicked, THEN expect to be routed to Add Dog page.
  await page.getByRole("link", { name: "Add Pet" }).click();
  await expect(page).toHaveURL(urlOf(RoutePath.USER_ADD_DOG));

  // WHEN dog details are filled in
  const dogName = generateDogName();
  await page.getByLabel("Name").fill(dogName);
  await page.getByLabel("Breed").fill("UI_TEST_DOG");
  await page.locator('input[name="dogBirthday"]').fill(getBirthday(3));
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

  // AND Save is clicked
  await page.getByRole("button", { name: "Save" }).click();

  // THEN expect to be routed to My Pets page.
  await expect(page).toHaveURL(urlOf(RoutePath.USER_MY_PETS));

  // AND expect new dog to be in the list.
  await expect(page.getByText(dogName)).toBeVisible();
});

function generateDogName(): string {
  const tsid = formatDateTime(new Date(), {
    format: "yyyy-MM-dd hh:MM:ss.SSS",
    timeZone: SINGAPORE_TIME_ZONE,
  });
  return `SGT ${tsid}`;
}

function getBirthday(ageYears: number): string {
  const ts = new Date();
  const y = ts.getUTCFullYear() - ageYears;
  const m = ts.getUTCMonth() + 1;
  const d = ts.getUTCDate();
  const ymd = sprintf("%04d-%02d-%02d", y, m, d);
  return ymd;
}
