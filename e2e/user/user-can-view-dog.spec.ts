import { test, expect } from "@playwright/test";
import { registerTestUser } from "../_lib/init/register-test-user";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";
import { UserViewDogPage } from "../_lib/pom/pages/user-view-dog-page";
import { RequiredDateField } from "@/app/_lib/field-schemas/required-date-field";

test("user can view dog", async ({ page }) => {
  const {
    context,
    dogName,
    dogBreed,
    dogWeightKg,
    dogBirthday,
    dogGender,
    ageYears,
  } = await registerTestUser({ page });

  const pgList = new UserMyPetsPage(context);
  const pgView = new UserViewDogPage(context);

  await pgList.checkUrl();
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
