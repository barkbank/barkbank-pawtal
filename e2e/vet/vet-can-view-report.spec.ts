import { test, expect } from "@playwright/test";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doCreateAppointment } from "../_lib/ops/do-create-appointment";
import { VetAppointmentListPage } from "../_lib/pom/pages/vet-appointment-list-page";
import { VetAppointmentSubmitReportPage } from "../_lib/pom/pages/vet-appointment-submit-report-page";
import { NavComponent } from "../_lib/pom/layout/nav-component";
import { VetReportListPage } from "../_lib/pom/pages/vet-report-list-page";
import { VetReportViewPage } from "../_lib/pom/pages/vet-report-view-page";
import { ToastComponent } from "../_lib/pom/layout/toast-component";

test("vet can view report", async ({ page }, testInfo) => {
  testInfo.setTimeout(60000);
  const context = await initPomContext({ page });
  const { dogName } = await doCreateAppointment(context);

  const pgAppointmentList = new VetAppointmentListPage(context);
  const pgSubmit = new VetAppointmentSubmitReportPage(context);
  const sideBarOrDock = new NavComponent(context);
  const pgReportList = new VetReportListPage(context);
  const pgView = new VetReportViewPage(context);
  const toast = new ToastComponent(context);

  // Submit a report
  await pgAppointmentList.checkReady();
  await pgAppointmentList
    .appointmentCard({ dogName })
    .submitReportButton()
    .click();
  await pgSubmit.checkReady();
  await pgSubmit.visitDateField().fill("13 Jan 2021");
  await pgSubmit.dogWeightField().fill("42.5");
  await pgSubmit.dogBcsSelector().click();
  await pgSubmit.dogBcsOption5().click();
  await pgSubmit.dogHeartwormOption_POSITIVE().click();
  await pgSubmit.dogDea1_POSITIVE().click();
  await pgSubmit.dogDidDonateBlood_NO().click();
  await pgSubmit.ineligibilityReasonTextArea().fill("The dog is too fat.");
  await pgSubmit.dogEligibility_TEMPORARILY_INELIGIBLE().click();
  await pgSubmit.ineligibilityExpiryDateField().fill("1 Feb 2022");
  await pgSubmit.submitButton().click();
  await expect(toast.locator()).toContainText("Submitted");
  await toast.closeButton().click();
  await pgAppointmentList.checkReady();

  // Navigate to view report page
  await pgAppointmentList.checkReady();
  await sideBarOrDock.vetReportsOption().click();
  await pgReportList.checkReady();
  await pgReportList.reportCard({ dogName }).locator().click();
  await pgView.checkReady();

  // Check values
  await pgView.checkReady();
  await expect(
    pgView.field("Visit Date").getByText("13 Jan 2021", { exact: true }),
  ).toBeVisible();
  await expect(
    pgView.field("Ineligible Until").getByText("1 Feb 2022", { exact: false }),
  ).toBeVisible();
  await expect(
    pgView.field("Dog Weight (KG)").getByText("42.5", { exact: true }),
  ).toBeVisible();
  await expect(
    pgView.field("Dog Name").getByText(dogName, { exact: true }),
  ).toBeVisible();
  await expect(
    pgView
      .field("Blood Test Result")
      .getByText("DEA 1 Positive", { exact: true }),
  ).toBeVisible();
  await expect(
    pgView
      .field("Ingligibility Reason")
      .getByText("The dog is too fat.", { exact: true }),
  ).toBeVisible();
});
