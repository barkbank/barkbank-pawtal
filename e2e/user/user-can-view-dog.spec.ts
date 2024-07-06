import { test, expect } from "@playwright/test";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";
import { UserViewDogPage } from "../_lib/pom/pages/user-view-dog-page";
import { RequiredDateField } from "@/app/_lib/field-schemas/required-date-field";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doRegister } from "../_lib/ops/do-register";

test("user can view dog", async ({ page }) => {
  const context = await initPomContext({ page });
  const {
    dog: { dogName, dogBreed, dogWeightKg, dogBirthday, dogGender, ageYears },
  } = await doRegister(context);

  const pgList = new UserMyPetsPage(context);
  const pgView = new UserViewDogPage(context);

  await pgList.checkReady();
  await pgList.dogCardItem(dogName).locator().click();

  await pgView.checkUrl();
  await expect(
    pgView.page().getByRole("heading", { name: dogName }),
  ).toBeVisible();
  await expect(
    pgView.page().getByText(`is eligible for blood donation`),
  ).toContainText(dogName);
  await expect(pgView.dogBreedItem()).toContainText(dogBreed);
  await expect(pgView.dogWeightItem()).toContainText(dogWeightKg);
  if (dogGender === "MALE") {
    await expect(pgView.dogGenderItem()).toContainText("Male");
    await expect(pgView.dogEverPregnantItem()).toContainText("N.A.");
  } else {
    await expect(pgView.dogGenderItem()).toContainText("Female");
    await expect(pgView.dogEverPregnantItem()).toContainText(
      "No, never pregnant",
    );
  }
  await expect(pgView.dogBirthdayItem()).toContainText(
    formatDogBirthday(dogBirthday),
  );
  await expect(pgView.dogAgeItem()).toContainText(`${ageYears} years 0 months`);
  await expect(pgView.dogBloodTypeItem()).toContainText("Unknown");
  await expect(pgView.dogEverReceivedTransfusionItem()).toContainText(
    "No, never received blood transfusion",
  );
  await expect(pgView.dogPreferredVetItem()).toContainText("Vet Clinic 1");
});

function formatDogBirthday(dogBirthday: string): string {
  const field = RequiredDateField.new();
  const birthdayDate = field.parse(dogBirthday);
  const birthdayString = field.format(birthdayDate);
  return birthdayString;
}
