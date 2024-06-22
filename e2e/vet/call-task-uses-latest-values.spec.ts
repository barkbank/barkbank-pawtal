import { test, expect } from "@playwright/test";
import { registerTestUser } from "../_lib/init/register-test-user";
import { doLogoutSequence } from "../_lib/ops/logout-sequence";
import { loginKnownVet } from "../_lib/init/login-known-vet";
import { VetSchedulePage } from "../_lib/pom/pages/vet-schedule-page";
import { VetAppointmentListPage } from "../_lib/pom/pages/vet-appointment-list-page";
import { VetReportListPage } from "../_lib/pom/pages/vet-report-list-page";
import { NavComponent } from "../_lib/pom/layout/nav-component";
import { VetAppointmentSubmitReportPage } from "../_lib/pom/pages/vet-appointment-submit-report-page";
import { doGetIsMobile } from "../_lib/ops/do-get-is-mobile";
import { toString } from "lodash";
import { ApiClient } from "../_lib/pom/api/api-client";
import { SGT_UI_DATE, formatDateTime } from "@/lib/utilities/bark-time";

test("call task uses latest values", async ({ page, request }) => {
  const { context, dogName, dogWeightKg, userName } = await registerTestUser({
    page,
  });
  await doLogoutSequence({ context });
  await loginKnownVet({ page });

  const api = new ApiClient(context, request);

  const pgSchedule = new VetSchedulePage(context);
  const pgAppointments = new VetAppointmentListPage(context);
  const pgSubmit = new VetAppointmentSubmitReportPage(context);
  const pgReports = new VetReportListPage(context);
  const sidebar = new NavComponent(context);

  await pgSchedule.checkUrl();
  await pgSchedule.dogCard(dogName).locator().click();
  const isMobile = await doGetIsMobile(context);
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

  // For this test to work, the profile modification time needs to be before the
  // visit date. However, since profile modification time is set by
  // CURRENT_TIMESTAMP above, and the maximum visitDate is today's date due to
  // form validation, in the following we push back all profile modification
  // times within the last day to two days ago.
  {
    const _sql = `
    UPDATE dogs
    SET profile_modification_time = (CURRENT_TIMESTAMP - INTERVAL '2 days')
    WHERE profile_modification_time > (CURRENT_TIMESTAMP - INTERVAL '1 day')
    `;
    await api.sql(_sql, []);
  }
  const visitDate = formatDateTime(new Date(), SGT_UI_DATE);

  await pgSubmit.visitDateField().fill(visitDate);
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
