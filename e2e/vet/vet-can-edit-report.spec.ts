import { test, expect } from "@playwright/test";
import { initPomContext } from "../_lib/init/init-pom-context";
import { doCreateAppointment } from "../_lib/sequences/do-create-appointment";
import { VetAppointmentsListPage } from "../_lib/pom/pages/vet-appointments-list-page";
import { VetSubmitReportPage } from "../_lib/pom/pages/vet-submit-report-page";
import { NavComponent } from "../_lib/pom/layout/nav-component";
import { VetReportListPage } from "../_lib/pom/pages/vet-report-list-page";
import { PomContext } from "../_lib/pom/core/pom-object";
import { VetEditReportPage } from "../_lib/pom/pages/vet-edit-report-page";

test("vet can edit report", async ({ page }) => {
  const context = await initPomContext({ page });
  const { dogName } = await givenSubmittedReport(context);

  // Should be DEA1.1 Positive at first
  const pg1 = new VetReportListPage(context);
  await expect(pg1.reportCard({ dogName }).locator()).toBeVisible();
  await expect(
    pg1.reportCard({ dogName }).dea1Point1PositiveBadge(),
  ).toBeVisible();

  // Edit to DEA1.1 Negative
  await navigateToEditReportPage(context, { dogName });
  await changeBloodTypeToNegative(context);

  // Should now be DEA1.1 Negative
  await expect(pg1.reportCard({ dogName }).locator()).toBeVisible();
  await expect(
    pg1.reportCard({ dogName }).dea1Point1NegativeBadge(),
  ).toBeVisible();
});

async function givenSubmittedReport(context: PomContext) {
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
  return { dogName };
}

async function navigateToEditReportPage(
  context: PomContext,
  args: { dogName: string },
) {
  const { dogName } = args;
  const pg1 = new VetReportListPage(context);
  const card = pg1.reportCard({ dogName });
  await card.editLink().click();

  const pg2 = new VetEditReportPage(context);
  await pg2.checkUrl();
}

async function changeBloodTypeToNegative(context: PomContext) {
  const pg1 = new VetEditReportPage(context);
  await pg1.checkUrl();
  await pg1.dogDea1Point1_NEGATIVE().click();
  await pg1.submitButton().click();
}
