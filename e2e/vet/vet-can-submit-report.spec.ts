import { test, expect } from "@playwright/test";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doCreateAppointment } from "../_lib/ops/do-create-appointment";
import { VetAppointmentListPage } from "../_lib/pom/pages/vet-appointment-list-page";
import { VetAppointmentSubmitReportPage } from "../_lib/pom/pages/vet-appointment-submit-report-page";
import { NavComponent } from "../_lib/pom/layout/nav-component";
import { VetReportListPage } from "../_lib/pom/pages/vet-report-list-page";

test("vet can submit report", async ({ page }) => {
  const context = await initPomContext({ page });
  const { dogName } = await doCreateAppointment(context);

  const pg1 = new VetAppointmentListPage(context);
  await pg1.checkUrl();
  await pg1.appointmentCard({ dogName }).submitReportButton().click();

  const pg2 = new VetAppointmentSubmitReportPage(context);
  await pg2.checkUrl();
  await pg2.visitDateField().fill("11 May 2024");
  await pg2.dogWeightField().fill("28.61");
  await pg2.dogBcsSelector().click();
  await pg2.dogBcsOption8().click();
  await pg2.dogHeartwormOption_NEGATIVE().click();
  await pg2.dogDea1Point1_POSITIVE().click();
  await pg2.dogDidDonateBlood_YES().click();
  await pg2.submitButton().click();

  const pg3 = new VetAppointmentListPage(context);
  await pg3.checkUrl();
  await expect(pg3.appointmentCard({ dogName }).locator()).not.toBeVisible();

  const nav = new NavComponent(context);
  await nav.vetReportsOption().click();

  const pg4 = new VetReportListPage(context);
  await expect(pg4.reportCard({ dogName }).locator()).toBeVisible();
});
