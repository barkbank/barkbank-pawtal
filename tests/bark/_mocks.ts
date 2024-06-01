import { BarkReportData } from "@/lib/bark/models/bark-report-data";
import { POS_NEG_NIL, REPORTED_INELIGIBILITY } from "@/lib/data/db-enums";
import { MILLIS_PER_WEEK } from "@/lib/utilities/bark-millis";

export function mockReportData(): BarkReportData {
  return {
    visitTime: new Date(Date.now() - MILLIS_PER_WEEK),
    dogWeightKg: 25,
    dogBodyConditioningScore: 9,
    dogHeartworm: POS_NEG_NIL.NEGATIVE,
    dogDea1Point1: POS_NEG_NIL.NEGATIVE,
    ineligibilityStatus: REPORTED_INELIGIBILITY.NIL,
    ineligibilityReason: "",
    ineligibilityExpiryTime: null,
    dogDidDonateBlood: true,
  };
}
