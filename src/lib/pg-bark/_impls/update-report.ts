import { BarkReportData } from "@/lib/bark/bark-models";
import { PgBarkServiceConfig } from "../pg-bark-service";
import { CODE } from "@/lib/utilities/bark-code";

export async function updateReport(
  config: PgBarkServiceConfig,
  args: { reportId: string; reportData: BarkReportData },
): Promise<
  | typeof CODE.OK
  | typeof CODE.ERROR_REPORT_NOT_FOUND
  | typeof CODE.STORAGE_FAILURE
> {
  const { dbPool } = config;
  const { reportId, reportData } = args;
  const {
    visitTime,
    dogWeightKg,
    dogBodyConditioningScore,
    dogHeartworm,
    dogDea1Point1,
    ineligibilityStatus,
    ineligibilityReason,
    ineligibilityExpiryTime,
    dogDidDonateBlood,
  } = reportData;
  return CODE.OK;
}
