import { BarkReport } from "@/lib/bark/bark-models";
import { CODE } from "@/lib/utilities/bark-code";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { PgBarkServiceConfig } from "../pg-bark-service";
import { SQL_QUERY, loadSql } from "../_sql/load-sql";
import { dbResultQuery } from "@/lib/data/db-utils";

export async function getReport(
  config: PgBarkServiceConfig,
  args: { reportId: string },
): Promise<
  Result<
    { report: BarkReport },
    typeof CODE.ERROR_REPORT_NOT_FOUND | typeof CODE.STORAGE_FAILURE
  >
> {
  const { dbPool } = config;
  const { reportId } = args;
  const sql = loadSql(SQL_QUERY.SELECT_REPORT);
  type Row = Omit<BarkReport, "ineligibilityReason"> & {
    encryptedIneligibilityReason: string;
  };
  const { result, error } = await dbResultQuery<Row>(dbPool, sql, [reportId]);
  if (error === CODE.DB_QUERY_FAILURE) {
    console.error("db query failed");
    return Err(CODE.STORAGE_FAILURE);
  }
  if (result.rows.length === 0) {
    return Err(CODE.ERROR_REPORT_NOT_FOUND);
  }
  if (result.rows.length !== 1) {
    console.error("result has more than one row");
    return Err(CODE.STORAGE_FAILURE);
  }
  const row: Row = result.rows[0];
  const { encryptedIneligibilityReason, ...otherFields } = row;
  const decryptionResult = await decryptReason(
    config,
    encryptedIneligibilityReason,
  );
  if (decryptionResult.error !== undefined) {
    return Err(decryptionResult.error);
  }
  const { ineligibilityReason } = decryptionResult.result;
  const report: BarkReport = { ineligibilityReason, ...otherFields };
  return Ok({ report });
}

async function decryptReason(
  config: PgBarkServiceConfig,
  encryptedIneligibilityReason: string,
): Promise<
  Result<
    {
      ineligibilityReason: string;
    },
    typeof CODE.STORAGE_FAILURE
  >
> {
  if (encryptedIneligibilityReason === "") {
    return Ok({ ineligibilityReason: "" });
  }
  const { textEncryptionService } = config;
  const { result, error } = await textEncryptionService.decrypt(
    encryptedIneligibilityReason,
  );
  if (error !== undefined) {
    console.error(`decryption error: ${error}`);
    return Err(CODE.STORAGE_FAILURE);
  }
  return Ok({
    ineligibilityReason: result.data,
  });
}
