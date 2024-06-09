import { test, expect } from "@playwright/test";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doCreateAppointment } from "../_lib/sequences/do-create-appointment";
import { VetAppointmentListPage } from "../_lib/pom/pages/vet-appointment-list-page";
import { VetAppointmentSubmitReportPage } from "../_lib/pom/pages/vet-appointment-submit-report-page";
import { NavComponent } from "../_lib/pom/layout/nav-component";
import { VetReportListPage } from "../_lib/pom/pages/vet-report-list-page";
import { VetReportViewPage } from "../_lib/pom/pages/vet-report-view-page";

test("vet can view report", async ({ page }) => {
  const context = await initPomContext({ page });
  const { dogName } = await doCreateAppointment(context);

  const pgAppointmentList = new VetAppointmentListPage(context);
  const pgSubmit = new VetAppointmentSubmitReportPage(context);
  const sideBarOrDock = new NavComponent(context);
  const pgReportList = new VetReportListPage(context);
  const pgView = new VetReportViewPage(context);

  // Submit a report
  await pgAppointmentList.checkUrl();
  await pgAppointmentList
    .appointmentCard({ dogName })
    .submitReportButton()
    .click();
  await pgSubmit.checkUrl();
  await pgSubmit.visitDateField().fill("13 Jan 2021");
  await pgSubmit.dogWeightField().fill("42.5");
  await pgSubmit.dogBcsSelector().click();
  await pgSubmit.dogBcsOption5().click();
  await pgSubmit.dogHeartwormOption_POSITIVE().click();
  await pgSubmit.dogDea1Point1_POSITIVE().click();
  await pgSubmit.dogDidDonateBlood_NO().click();
  await pgSubmit.ineligibilityReasonTextArea().fill("The dog is too fat.");
  await pgSubmit.dogEligibility_TEMPORARILY_INELIGIBLE().click();
  await pgSubmit.ineligibilityExpiryDateField().fill("1 Feb 2022");
  await pgSubmit.submitButton().click();
  await pgAppointmentList.checkUrl();

  // Navigate to view report page
  await pgAppointmentList.checkUrl();
  await sideBarOrDock.vetReportsOption().click();
  await pgReportList.checkUrl();
  await pgReportList.reportCard({ dogName }).locator().click();
  await pgView.checkUrl();

  // Check values
  await pgView.checkUrl();
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
      .getByText("DEA1.1 Positive", { exact: true }),
  ).toBeVisible();
  await expect(
    pgView
      .field("Ingligibility Reason")
      .getByText("The dog is too fat.", { exact: true }),
  ).toBeVisible();
});
