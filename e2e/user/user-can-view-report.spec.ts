import { test, expect } from "@playwright/test";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doRegister } from "../_lib/ops/do-register";
import { doLoginKnownVet } from "../_lib/ops/do-login-known-vet";
import { doLogoutSequence } from "../_lib/ops/do-logout-sequence";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";
import { UserViewDogPage } from "../_lib/pom/pages/user-view-dog-page";
import { UserEditDogPage } from "../_lib/pom/pages/user-edit-dog-page";
import { UserViewReportPage } from "../_lib/pom/pages/user-view-report-page";

test("user can view report", async ({ page }) => {
  const context = await initPomContext({page});
  const {user, dog} = await doRegister(context);
  await doLoginKnownVet(context);

  const {userEmail} = user;
  const {dogName, dogBreed} = dog;
  const reportedDogWeightKg = "111";
  const updatedDogWeightKg = "222";

  await doScheduleAppointment(context, {dogName});
  await doSubmitReport(context, {dogName, overrides: {dogWeightKg: reportedDogWeightKg}});
  await doLogoutSequence(context);
  await doUserLoginSequence(context, {userEmail});

  const pgPets = new UserMyPetsPage(context);
  const pgViewDog = new UserViewDogPage(context);
  const pgEditDog = new UserEditDogPage(context);
  const pgViewReport = new UserViewReportPage(context);

  // Verify that dog's weight is the reported dog weight.
  await pgPets.checkUrl();
  await pgPets.dogCardItem(dogName).locator().click();
  await pgViewDog.checkUrl();
  await expect(pgViewDog.dogWeightItem()).toHaveValue(reportedDogWeightKg);

  // Edit the dog's weight and verify it is updated.
  await pgViewDog.editButton().click();
  await pgEditDog.dogWeightField().fill(updatedDogWeightKg);
  await pgEditDog.saveButton().click();
  await pgViewDog.checkUrl();
  await expect(pgViewDog.dogWeightItem()).toHaveValue(updatedDogWeightKg);

  // View the report and verify it still has the reported weight, and other fields.
  await pgViewDog.firstReportItem().locator().click();
  await pgViewReport.checkUrl();
  await expect(pgViewReport.dogWeightItem()).toHaveValue(reportedDogWeightKg);
  await expect(pgViewReport.dogBreedItem()).toHaveValue(dogBreed);
});
