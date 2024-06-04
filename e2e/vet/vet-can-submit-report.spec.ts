import { test, expect } from "@playwright/test";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doCreateAppointment } from "../_lib/sequences/do-create-appointment";
import { VetAppointmentsListPage } from "../_lib/pom/pages/vet-appointments-list-page";
import { VetCancelAppointmentPage } from "../_lib/pom/pages/vet-cancel-appointment-page";
import { VetSubmitReportPage } from "../_lib/pom/pages/vet-submit-report-page";
import { NavComponent } from "../_lib/pom/layout/nav-component";
import { VetReportListPage } from "../_lib/pom/pages/vet-report-list-page";

test("vet can submit report", async ({ page }) => {
  const context = await initPomContext({ page });
  const { dogName } = await doCreateAppointment(context);

  const pg1 = new VetAppointmentsListPage(context);
  await pg1.checkUrl();
  await pg1.appointmentCard({ dogName }).submitReportButton().click();

  const pg2 = new VetSubmitReportPage(context);
  await pg2.checkUrl();
  await pg2.visitTimeField().fill("6 May 2024, 13:30");
  await pg2.dogWeightField().fill("27.89");
  await pg2.dogBcsSelector().click();
  await pg2.dogBcsOption8().click();
  await pg2.dogHeartwormOption_NEGATIVE().click();
  await pg2.dogDea1Point1_POSITIVE().click();
  await pg2.dogDidDonateBlood_YES().click();
  await pg2.dogEligibility_ELIGIBLE().click();
  await pg2.submitButton().click();

  const pg3 = new VetAppointmentsListPage(context);
  await pg3.checkUrl();
  await expect(pg3.appointmentCard({ dogName }).locator()).not.toBeVisible();

  const nav = new NavComponent(context);
  await nav.vetReportsOption().click();

  const pg4 = new VetReportListPage(context);
  await expect(pg4.reportCard({ dogName }).locator()).toBeVisible();
});
