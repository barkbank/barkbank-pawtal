import { test, expect } from "@playwright/test";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doCreateAppointment } from "../_lib/sequences/do-create-appointment";
import { VetAppointmentsListPage } from "../_lib/pom/pages/vet-appointments-list-page";
import { VetSubmitReportPage } from "../_lib/pom/pages/vet-submit-report-page";
import { NavComponent } from "../_lib/pom/layout/nav-component";
import { VetReportListPage } from "../_lib/pom/pages/vet-report-list-page";
import { PomContext } from "../_lib/pom/core/pom-object";
import { VetEditReportPage } from "../_lib/pom/pages/vet-edit-report-page";
import { VetReportViewPage } from "../_lib/pom/pages/vet-report-view-page";

test("vet can edit report", async ({ page }) => {
  const context = await initPomContext({ page });
  const { dogName } = await givenSubmittedReport(context);

  const pgList = new VetReportListPage(context);

  // Should be DEA1.1 Positive at first
  await pgList.checkUrl();
  await expect(pgList.reportCard({ dogName }).locator()).toBeVisible();
  await expect(
    pgList.reportCard({ dogName }).dea1Point1PositiveBadge(),
  ).toBeVisible();

  // Edit to DEA1.1 Negative
  await changeBloodTypeToNegative(context, { dogName });

  // Should now be DEA1.1 Negative
  await pgList.checkUrl();
  await expect(pgList.reportCard({ dogName }).locator()).toBeVisible();
  await expect(
    pgList.reportCard({ dogName }).dea1Point1NegativeBadge(),
  ).toBeVisible();
});

async function givenSubmittedReport(context: PomContext): Promise<{
  dogName: string;
}> {
  const { dogName } = await doCreateAppointment(context);

  const pgList = new VetAppointmentsListPage(context);
  const pgSubmit = new VetSubmitReportPage(context);
  const sideBarOrDock = new NavComponent(context);
  const pgReportList = new VetReportListPage(context);

  await pgList.checkUrl();
  await pgList.appointmentCard({ dogName }).submitReportButton().click();

  await pgSubmit.checkUrl();
  await pgSubmit.visitTimeField().fill("6 May 2024, 13:30");
  await pgSubmit.dogWeightField().fill("27.89");
  await pgSubmit.dogBcsSelector().click();
  await pgSubmit.dogBcsOption8().click();
  await pgSubmit.dogHeartwormOption_NEGATIVE().click();
  await pgSubmit.dogDea1Point1_POSITIVE().click();
  await pgSubmit.dogDidDonateBlood_YES().click();
  await pgSubmit.dogEligibility_ELIGIBLE().click();
  await pgSubmit.submitButton().click();

  await pgList.checkUrl();
  await expect(pgList.appointmentCard({ dogName }).locator()).not.toBeVisible();

  await sideBarOrDock.vetReportsOption().click();

  await pgReportList.checkUrl();
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
  const pgEdit = new VetEditReportPage(context);

  await pgList.checkUrl();
  await pgList.reportCard({ dogName }).locator().click();
  await pgView.checkUrl();
  await pgView.editButton().click();
  await pgEdit.checkUrl();

  await pgEdit.dogDea1Point1_NEGATIVE().click();
  await pgEdit.submitButton().click();

  await pgView.checkUrl();
  await pgView.backButton().click();
  await pgList.checkUrl();
}
