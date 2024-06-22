import { test, expect } from "@playwright/test";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doRegister } from "../_lib/ops/do-register";
import { doLoginKnownVet } from "../_lib/ops/do-login-known-vet";
import { doLogoutSequence } from "../_lib/ops/do-logout-sequence";
import { UserMyPetsPage } from "../_lib/pom/pages/user-my-pets-page";
import { UserViewDogPage } from "../_lib/pom/pages/user-view-dog-page";
import { UserEditDogPage } from "../_lib/pom/pages/user-edit-dog-page";
import { UserViewReportPage } from "../_lib/pom/pages/user-view-report-page";
import { doScheduleAppointment } from "../_lib/ops/do-schedule-appointment";
import { doSubmitReport } from "../_lib/ops/do-submit-report";
import { doUserLoginSequence } from "../_lib/ops/do-user-login-sequence";
import { MILLIS_PER_DAY } from "@/lib/utilities/bark-millis";
import {
  SGT_UI_DATE,
  SINGAPORE_TIME_ZONE,
  formatDateTime,
  parseCommonDate,
} from "@/lib/utilities/bark-time";

test("user can view report", async ({ page }) => {
  const reportedDogWeightKg = "111";
  const yesterday = new Date(Date.now() - MILLIS_PER_DAY);
  const visitTimeText = formatDateTime(yesterday, SGT_UI_DATE);
  const visitTime = parseCommonDate(visitTimeText, SINGAPORE_TIME_ZONE);

  const context = await initPomContext({ page });

  // User registers and logs out.
  const { user, dog } = await doRegister(context);
  const { userEmail } = user;
  const { dogName, dogBreed, dogWeightKg: registeredDogWeightKg } = dog;
  await doLogoutSequence(context);

  // Vet schedules appointment and submits report. Then logs out.
  const {
    knownVet: { vetName },
  } = await doLoginKnownVet(context);
  await doScheduleAppointment(context, { dogName });
  await doSubmitReport(context, {
    dogName,
    overrides: {
      visitTime,
      dogWeightKg: parseFloat(reportedDogWeightKg),
    },
  });
  await doLogoutSequence(context);

  // User logs in again.
  await doUserLoginSequence(context, { userEmail });

  const pgPets = new UserMyPetsPage(context);
  const pgViewDog = new UserViewDogPage(context);
  const pgEditDog = new UserEditDogPage(context);
  const pgViewReport = new UserViewReportPage(context);

  // Verify that dog's weight is the registration dog weight, because
  // registration dog weight is the most recent.
  await pgPets.checkUrl();
  await pgPets.dogCardItem(dogName).locator().click();
  await pgViewDog.checkUrl();
  await expect(pgViewDog.dogWeightItem()).toContainText(registeredDogWeightKg);

  // View the report and verify it has the reported weight, and other fields.
  await pgViewDog.getReportItem({ visitTime, vetName }).click();
  await pgViewReport.checkUrl();
  await expect(pgViewReport.dogWeightItem()).toContainText(reportedDogWeightKg);
  await expect(pgViewReport.dogBreedItem()).toContainText(dogBreed);
});
