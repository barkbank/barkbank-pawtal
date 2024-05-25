import { BarkReportData } from "@/lib/bark/bark-models";
import { PgBarkServiceConfig } from "../pg-bark-service";
import { CODE } from "@/lib/utilities/bark-code";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { SQL_QUERY, loadSql } from "../_sql/load-sql";
import { dbResultQuery } from "@/lib/data/db-utils";

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
  const res1 = await encryptReason(config, ineligibilityReason);
  if (res1.error !== undefined) {
    return res1.error;
  }
  const { encryptedIneligibilityReason } = res1.result;
  const sql = loadSql(SQL_QUERY.UPDATE_REPORT);
  const { result, error } = await dbResultQuery<{
    reportModificationTime: Date;
  }>(dbPool, sql, [
    reportId,

    visitTime,

    dogWeightKg,
    dogBodyConditioningScore,
    dogHeartworm,
    dogDea1Point1,

    ineligibilityStatus,
    encryptedIneligibilityReason,
    ineligibilityExpiryTime,

    dogDidDonateBlood,
  ]);
  if (error === CODE.DB_QUERY_FAILURE) {
    return CODE.STORAGE_FAILURE;
  }
  if (result.rows.length !== 1) {
    return CODE.STORAGE_FAILURE;
  }
  return CODE.OK;
}

async function encryptReason(
  config: PgBarkServiceConfig,
  ineligibilityReason: string,
): Promise<
  Result<
    {
      encryptedIneligibilityReason: string;
    },
    typeof CODE.STORAGE_FAILURE
  >
> {
  const { textEncryptionService } = config;
  if (ineligibilityReason === "") {
    return Ok({ encryptedIneligibilityReason: "" });
  }
  const { result, error } =
    await textEncryptionService.encrypt(ineligibilityReason);
  if (error !== undefined) {
    console.error(`encryption failed: ${error}`);
    return Err(CODE.STORAGE_FAILURE);
  }
  return Ok({
    encryptedIneligibilityReason: result.encryptedData,
  });
}
