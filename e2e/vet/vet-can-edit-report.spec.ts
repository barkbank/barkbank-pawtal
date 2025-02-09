import { test, expect } from "@playwright/test";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doCreateAppointment } from "../_lib/ops/do-create-appointment";
import { VetAppointmentListPage } from "../_lib/pom/pages/vet-appointment-list-page";
import { VetAppointmentSubmitReportPage } from "../_lib/pom/pages/vet-appointment-submit-report-page";
import { NavComponent } from "../_lib/pom/layout/nav-component";
import { VetReportListPage } from "../_lib/pom/pages/vet-report-list-page";
import { PomContext } from "../_lib/pom/core/pom-object";
import { VetReportEditPage } from "../_lib/pom/pages/vet-report-edit-page";
import { VetReportViewPage } from "../_lib/pom/pages/vet-report-view-page";
import { ToastComponent } from "../_lib/pom/layout/toast-component";

test("vet can edit report", async ({ page }, testInfo) => {
  testInfo.setTimeout(60000);
  const context = await initPomContext({ page });
  const { dogName } = await givenSubmittedReport(context);

  const pgList = new VetReportListPage(context);

  // Should be DEA 1 Positive at first
  await pgList.checkReady();
  await expect(pgList.reportCard({ dogName }).locator()).toBeVisible();
  await expect(
    pgList.reportCard({ dogName }).dea1PositiveBadge(),
  ).toBeVisible();

  // Edit to DEA 1 Negative
  await changeBloodTypeToNegative(context, { dogName });

  // Should now be DEA 1 Negative
  await pgList.checkReady();
  await expect(pgList.reportCard({ dogName }).locator()).toBeVisible();
  await expect(
    pgList.reportCard({ dogName }).dea1NegativeBadge(),
  ).toBeVisible();
});

async function givenSubmittedReport(context: PomContext): Promise<{
  dogName: string;
}> {
  const { dogName } = await doCreateAppointment(context);

  const pgList = new VetAppointmentListPage(context);
  const pgSubmit = new VetAppointmentSubmitReportPage(context);
  const sideBarOrDock = new NavComponent(context);
  const pgReportList = new VetReportListPage(context);
  const toast = new ToastComponent(context);

  await pgList.checkReady();
  await pgList.appointmentCard({ dogName }).submitReportButton().click();

  await pgSubmit.checkReady();
  await expect(pgSubmit.submitButton()).toBeVisible();
  await pgSubmit.visitDateField().fill("6 May 2024");
  await pgSubmit.dogWeightField().fill("27.89");
  await pgSubmit.dogBcsSelector().click();
  await pgSubmit.dogBcsOption8().click();
  await pgSubmit.dogHeartwormOption_NEGATIVE().click();
  await pgSubmit.dogDea1_POSITIVE().click();
  await pgSubmit.dogDidDonateBlood_YES().click();
  await pgSubmit.submitButton().click();
  await expect(toast.locator()).toContainText("Submitted");
  await toast.closeButton().click();

  await pgList.checkReady();
  await expect(pgList.appointmentCard({ dogName }).locator()).not.toBeVisible();

  await sideBarOrDock.vetReportsOption().click();

  await pgReportList.checkReady();
  await expect(pgReportList.reportCard({ dogName }).locator()).toBeVisible();
  return { dogName };
}

async function changeBloodTypeToNegative(
  context: PomContext,
  args: { dogName: string },
) {
  const { dogName } = args;

  const pgList = new VetReportListPage(context);
  const pgView = new VetReportViewPage(context);
  const pgEdit = new VetReportEditPage(context);
  const toast = new ToastComponent(context);

  await pgList.checkReady();
  await pgList.reportCard({ dogName }).locator().click();
  await pgView.checkReady();
  await pgView.editIcon().click();
  await pgEdit.checkReady();
  await expect(pgEdit.submitButton()).toBeVisible();

  await pgEdit.dogDea1_NEGATIVE().click();
  await pgEdit.submitButton().click();
  await expect(toast.locator()).toContainText("Saved");
  await toast.closeButton().click();

  await pgView.checkReady();
  await expect(pgView.backButton()).toBeVisible();
  await pgView.backButton().click();
  await pgList.checkReady();
}
