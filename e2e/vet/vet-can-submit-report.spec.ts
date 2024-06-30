import { test, expect } from "@playwright/test";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doCreateAppointment } from "../_lib/ops/do-create-appointment";
import { VetAppointmentListPage } from "../_lib/pom/pages/vet-appointment-list-page";
import { VetAppointmentSubmitReportPage } from "../_lib/pom/pages/vet-appointment-submit-report-page";
import { NavComponent } from "../_lib/pom/layout/nav-component";
import { VetReportListPage } from "../_lib/pom/pages/vet-report-list-page";
import { ToastComponent } from "../_lib/pom/layout/toast-component";

test("vet can submit report", async ({ page }) => {
  const context = await initPomContext({ page });
  const { dogName } = await doCreateAppointment(context);

  const pgList = new VetAppointmentListPage(context);
  const pgSubmit = new VetAppointmentSubmitReportPage(context);
  const toast = new ToastComponent(context);
  const nav = new NavComponent(context);
  const pgReportList = new VetReportListPage(context);

  await pgList.checkUrl();
  await pgList.appointmentCard({ dogName }).submitReportButton().click();

  await pgSubmit.checkUrl();
  await expect(pgSubmit.submitButton()).toBeVisible();
  await pgSubmit.visitDateField().fill("11 May 2024");
  await pgSubmit.dogWeightField().fill("28.61");
  await pgSubmit.dogBcsSelector().click();
  await pgSubmit.dogBcsOption8().click();
  await pgSubmit.dogHeartwormOption_NEGATIVE().click();
  await pgSubmit.dogDea1Point1_POSITIVE().click();
  await pgSubmit.dogDidDonateBlood_YES().click();
  await pgSubmit.submitButton().click();
  await expect(toast.locator()).toContainText("Submitted");
  await toast.closeButton().click();

  await pgList.checkUrl();
  await expect(pgList.appointmentCard({ dogName }).locator()).not.toBeVisible();

  await nav.vetReportsOption().click();

  await expect(pgReportList.reportCard({ dogName }).locator()).toBeVisible();
});
