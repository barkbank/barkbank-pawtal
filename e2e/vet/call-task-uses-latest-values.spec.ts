import test from "@playwright/test";
import { registerTestUser } from "../_lib/init/register-test-user";
import { doLogoutSequence } from "../_lib/sequences/logout-sequence";
import { loginKnownVet } from "../_lib/init/login-known-vet";
import { VetSchedulePage } from "../_lib/pom/pages/vet-schedule-page";
import { VetAppointmentListPage } from "../_lib/pom/pages/vet-appointment-list-page";
import { VetReportListPage } from "../_lib/pom/pages/vet-report-list-page";
import { NavComponent } from "../_lib/pom/layout/nav-component";
import { VetAppointmentSubmitReportPage } from "../_lib/pom/pages/vet-appointment-submit-report-page";

test("call task uses latest values", async ({page}) => {
  const {context, dogName, dogWeightKg} = await registerTestUser({page});
  await doLogoutSequence({context});
  await loginKnownVet({page});

  const pgSchedule = new VetSchedulePage(context);
  const pgAppointments = new VetAppointmentListPage(context);
  const pgSubmit = new VetAppointmentSubmitReportPage(context);
  const pgReports = new VetReportListPage(context);
  const sidebar = new NavComponent(context);

  await pgSchedule.checkUrl();
  await pgSchedule.dogCard(dogName).locator().click();
  await pgSchedule.dogCard(dogName).scheduleButton().click();

  await sidebar.vetAppointmentsOption().click();

  await pgAppointments.checkUrl();
  await pgAppointments.appointmentCard({dogName}).submitReportButton().click();
  await pgSubmit.checkUrl();

  await pgSubmit.visitDateField().fill("21 Apr 2024");
  await pgSubmit.dogDidDonateBlood_NO().click();
  await pgSubmit.dogBcsOption5().click();
  await pgSubmit.dogDea1Point1_POSITIVE().click();

  // WIP: Continue this test.
})