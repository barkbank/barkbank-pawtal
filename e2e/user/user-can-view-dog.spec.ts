import { test, expect } from "@playwright/test";
import { registerTestUser } from "../_lib/init/register-test-user";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";
import { UserViewDogPage } from "../_lib/pom/pages/user-view-dog-page";
import {
  UTC_DATE_OPTION,
  formatDateTime,
  parseDateTime,
} from "@/lib/utilities/bark-time";

test("user can view dog", async ({ page }) => {
  const { context, dogName, dogBreed, dogWeightKg, dogBirthday } =
    await registerTestUser({ page });

  const pg1 = new UserMyPetsPage(context);
  await pg1.checkUrl();
  await pg1.dogCardItem(dogName).viewButton().click();

  const pg2 = new UserViewDogPage(context);
  await pg2.checkUrl();
  await expect(
    pg2.page().getByRole("heading", { name: dogName }),
  ).toBeVisible();
  await expect(
    pg2.page().getByText(`is eligible for blood donation`),
  ).toContainText(dogName);
  await expect(pg2.dogBreedItem()).toContainText(dogBreed);
  await expect(pg2.dogWeightItem()).toContainText(dogWeightKg);
  await expect(pg2.dogGenderItem()).toContainText("Male");
  await expect(pg2.dogBirthdayItem()).toContainText(
    formatDogBirthday(dogBirthday),
  );
  await expect(pg2.dogAgeItem()).toContainText("5 years 0 months");
  await expect(pg2.dogBloodTypeItem()).toContainText("Unknown");
  await expect(pg2.dogEverPregnantItem()).toContainText("N.A.");
  await expect(pg2.dogEverReceivedTransfusionItem()).toContainText(
    "No, never received blood transfusion",
  );
});

function formatDogBirthday(dogBirthday: string): string {
  const birthdayDate = parseDateTime(dogBirthday, UTC_DATE_OPTION);
  const birthdayString = formatDateTime(birthdayDate, UTC_DATE_OPTION);
  return birthdayString;
}
