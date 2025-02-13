import { test, expect } from "@playwright/test";
import { doLogoutSequence } from "../_lib/ops/do-logout-sequence";
import { doLoginKnownVet } from "../_lib/ops/do-login-known-vet";
import { VetSchedulePage } from "../_lib/pom/pages/vet-schedule-page";
import { VetAppointmentListPage } from "../_lib/pom/pages/vet-appointment-list-page";
import { NavComponent } from "../_lib/pom/layout/nav-component";
import { VetAppointmentSubmitReportPage } from "../_lib/pom/pages/vet-appointment-submit-report-page";
import { doGetIsMobile } from "../_lib/ops/do-get-is-mobile";
import { toString } from "lodash";
import { ApiClient } from "../_lib/pom/api/api-client";
import { SGT_UI_DATE, formatDateTime } from "@/lib/utilities/bark-time";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doRegister } from "../_lib/ops/do-register";
import { ToastComponent } from "../_lib/pom/layout/toast-component";

test("call task uses latest values", async ({ page, request }) => {
  const context = await initPomContext({ page });
  const {
    dog: { dogName, dogWeightKg },
  } = await doRegister(context);

  await doLogoutSequence(context);
  await doLoginKnownVet(context);

  const api = new ApiClient(context, request);

  const pgSchedule = new VetSchedulePage(context);
  const pgAppointments = new VetAppointmentListPage(context);
  const pgSubmit = new VetAppointmentSubmitReportPage(context);
  const sidebar = new NavComponent(context);
  const toast = new ToastComponent(context);

  await pgSchedule.checkReady();
  await pgSchedule.dogCard(dogName).locator().click();
  const isMobile = await doGetIsMobile(context);
  const activityArea = isMobile
    ? pgSchedule.dogCard(dogName)
    : pgSchedule.rightSidePane();
  await activityArea.scheduleButton().click();
  await expect(activityArea.scheduledBadge()).toBeVisible();

  await sidebar.vetAppointmentsOption().click();

  await pgAppointments.checkReady();
  await pgAppointments
    .appointmentCard({ dogName })
    .submitReportButton()
    .click();
  await pgSubmit.checkReady();

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
  await pgSubmit.dogDea1_POSITIVE().click();
  const newWeight = toString(parseFloat(dogWeightKg) * 2);
  await pgSubmit.dogWeightField().fill(newWeight);
  await pgSubmit.dogHeartwormOption_NEGATIVE().click();
  await pgSubmit.submitButton().click();
  await expect(toast.locator()).toContainText("Submitted");
  await toast.closeButton().click();

  await pgAppointments.checkReady();
  await sidebar.vetScheduleOption().click();
  await pgSchedule.checkReady();

  await expect(pgSchedule.dogCard(dogName).locator()).toBeVisible();
  await expect(pgSchedule.dogCard(dogName).locator()).toContainText(newWeight);
});
