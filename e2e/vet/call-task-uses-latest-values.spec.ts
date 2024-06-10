import { test, expect } from "@playwright/test";
import { registerTestUser } from "../_lib/init/register-test-user";
import { doLogoutSequence } from "../_lib/sequences/logout-sequence";
import { loginKnownVet } from "../_lib/init/login-known-vet";
import { VetSchedulePage } from "../_lib/pom/pages/vet-schedule-page";
import { VetAppointmentListPage } from "../_lib/pom/pages/vet-appointment-list-page";
import { VetReportListPage } from "../_lib/pom/pages/vet-report-list-page";
import { NavComponent } from "../_lib/pom/layout/nav-component";
import { VetAppointmentSubmitReportPage } from "../_lib/pom/pages/vet-appointment-submit-report-page";
import { getIsMobile } from "../_lib/e2e-test-utils";
import { toString } from "lodash";

test("call task uses latest values", async ({ page }) => {
  const { context, dogName, dogWeightKg, userName } = await registerTestUser({
    page,
  });
  await doLogoutSequence({ context });
  await loginKnownVet({ page });

  const pgSchedule = new VetSchedulePage(context);
  const pgAppointments = new VetAppointmentListPage(context);
  const pgSubmit = new VetAppointmentSubmitReportPage(context);
  const pgReports = new VetReportListPage(context);
  const sidebar = new NavComponent(context);

  await pgSchedule.checkUrl();
  await pgSchedule.dogCard(dogName).locator().click();
  const isMobile = await getIsMobile(context);
  const activityArea = isMobile
    ? pgSchedule.dogCard(dogName)
    : pgSchedule.rightSidePane();
  await activityArea.scheduleButton().click();

  await sidebar.vetAppointmentsOption().click();

  await pgAppointments.checkUrl();
  await pgAppointments
    .appointmentCard({ dogName })
    .submitReportButton()
    .click();
  await pgSubmit.checkUrl();

  await pgSubmit.visitDateField().fill("21 Apr 2024");
  await pgSubmit.dogDidDonateBlood_NO().click();
  await pgSubmit.dogBcsSelector().click();
  await pgSubmit.dogBcsOption5().click();
  await pgSubmit.dogDea1Point1_POSITIVE().click();
  const newWeight = toString(parseFloat(dogWeightKg) * 2);
  await pgSubmit.dogWeightField().fill(newWeight);
  await pgSubmit.dogHeartwormOption_NEGATIVE().click();
  await pgSubmit.submitButton().click();

  await pgAppointments.checkUrl();
  await sidebar.vetScheduleOption().click();
  await pgSchedule.checkUrl();

  await expect(pgSchedule.dogCard(dogName).locator()).toBeVisible();
  await expect(pgSchedule.dogCard(dogName).locator()).toContainText(newWeight);
});
