import { SGT_UI_DATE, formatDateTime } from "@/lib/utilities/bark-time";
import { PomContext } from "../pom/core/pom-object";
import { NavComponent } from "../pom/layout/nav-component";
import { VetAppointmentListPage } from "../pom/pages/vet-appointment-list-page";
import { VetAppointmentSubmitReportPage } from "../pom/pages/vet-appointment-submit-report-page";
import {
  BarkReportData,
  BarkReportDataSchema,
} from "@/lib/bark/models/bark-report-data";
import { POS_NEG_NIL } from "@/lib/bark/enums/pos-neg-nil";
import { REPORTED_INELIGIBILITY } from "@/lib/bark/enums/reported-ineligibility";
import { ToastComponent } from "../pom/layout/toast-component";

export async function doSubmitReport(
  context: PomContext,
  args: { dogName: string; overrides?: Partial<BarkReportData> },
) {
  const { dogName, overrides } = args;
  const values: BarkReportData = { ..._getBase(), ...overrides };

  const nav = new NavComponent(context);
  const pgList = new VetAppointmentListPage(context);
  const pgSubmit = new VetAppointmentSubmitReportPage(context);
  const toast = new ToastComponent(context);

  await nav.vetAppointmentsOption().click();
  await pgList.checkUrl();
  await pgList.appointmentCard({ dogName }).submitReportButton().click();
  await pgSubmit.checkUrl();

  await pgSubmit
    .visitDateField()
    .fill(formatDateTime(values.visitTime, SGT_UI_DATE));
  await pgSubmit.dogDidDonateBlood(values.dogDidDonateBlood).click();
  await pgSubmit.dogWeightField().fill(values.dogWeightKg.toString());
  await pgSubmit.dogBcsSelector().click();
  await pgSubmit.dogBcsOption(values.dogBodyConditioningScore).click();
  await pgSubmit.dogHeartwormOption(values.dogHeartworm).click();
  await pgSubmit.dogDea1Point1(values.dogDea1Point1).click();
  if (values.ineligibilityReason !== "") {
    await pgSubmit
      .ineligibilityReasonTextArea()
      .fill(values.ineligibilityReason);
  }
  await pgSubmit.submitButton().click();
  await expect(toast.locator()).toContainText("Submitted");
  await toast.closeButton().click();
  await pgList.checkUrl();
}

function _getBase(): BarkReportData {
  const res: BarkReportData = {
    visitTime: new Date(),
    dogWeightKg: 50.189,
    dogBodyConditioningScore: 5,
    dogHeartworm: POS_NEG_NIL.NIL,
    dogDea1Point1: POS_NEG_NIL.NIL,
    ineligibilityStatus: REPORTED_INELIGIBILITY.NIL,
    ineligibilityReason: "",
    ineligibilityExpiryTime: null,
    dogDidDonateBlood: false,
  };
  return BarkReportDataSchema.parse(res);
}
