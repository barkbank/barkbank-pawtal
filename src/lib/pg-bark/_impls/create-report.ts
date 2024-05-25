import { Err, Ok, Result } from "@/lib/utilities/result";
import { CODE } from "@/lib/utilities/bark-code";
import { PgBarkServiceConfig } from "../pg-bark-service";
import { BarkReportData } from "@/lib/bark/bark-models";
import { PoolClient } from "pg";
import {
  dbBegin,
  dbCommit,
  dbRelease,
  dbResultQuery,
  dbRollback,
} from "@/lib/data/db-utils";
import { loadSql } from "../_sql/load-sql";
import { EncryptionService } from "@/lib/services/encryption";

export async function createReport(
  config: PgBarkServiceConfig,
  args: {
    appointmentId: string;
    reportData: BarkReportData;
  },
): Promise<
  Result<
    { reportId: string },
    typeof CODE.ERROR_APPOINTMENT_NOT_FOUND | typeof CODE.STORAGE_FAILURE
  >
> {
  const { dbPool, textEncryptionService } = config;
  const { appointmentId, reportData } = args;
  const conn = await dbPool.connect();
  const ctx: _Context = {
    conn,
    textEncryptionService,
    appointmentId,
    reportData,
  };
  try {
    await dbBegin(conn);
    const checkResult = await checkAppointmentExists(ctx);
    if (checkResult !== CODE.OK) {
      return Err(checkResult);
    }
    const { result, error } = await insertReportAndUpdateCall(ctx);
    if (error !== undefined) {
      return Err(error);
    }
    await dbCommit(conn);
    return Ok(result);
  } catch {
    await dbRollback(conn);
    return Err(CODE.STORAGE_FAILURE);
  } finally {
    await dbRelease(conn);
  }
}

type _Context = {
  conn: PoolClient;
  textEncryptionService: EncryptionService;
  appointmentId: string;
  reportData: BarkReportData;
};

async function checkAppointmentExists(
  ctx: _Context,
): Promise<
  | typeof CODE.OK
  | typeof CODE.ERROR_APPOINTMENT_NOT_FOUND
  | typeof CODE.STORAGE_FAILURE
> {
  const { conn, appointmentId } = ctx;
  const sql = loadSql("select-appointment-exists");
  const { result, error } = await dbResultQuery<{ appointmentExists: boolean }>(
    conn,
    sql,
    [appointmentId],
  );
  if (error === CODE.DB_QUERY_FAILURE) {
    return CODE.STORAGE_FAILURE;
  }
  if (result.rows.length !== 1) {
    return CODE.STORAGE_FAILURE;
  }
  const { appointmentExists } = result.rows[0];
  if (!appointmentExists) {
    return CODE.ERROR_APPOINTMENT_NOT_FOUND;
  }
  return CODE.OK;
}

// WIP: Split this into insertReport and updateCall
async function insertReportAndUpdateCall(
  ctx: _Context,
): Promise<Result<{ reportId: string }, typeof CODE.STORAGE_FAILURE>> {
  const { conn, textEncryptionService, appointmentId, reportData } = ctx;
  const {
    visitTime,
    dogWeightKg,
    dogBodyConditioningScore,
    dogDidDonateBlood,
    dogHeartworm,
    dogDea1Point1,
    ineligibilityStatus,
    ineligibilityReason,
    ineligibilityExpiryTime,
  } = reportData;
  const encryptedIneligibilityReason =
    ineligibilityReason === ""
      ? ""
      : await textEncryptionService.getEncryptedData(ineligibilityReason);
  const sql = loadSql("insert-report-update-call");
  const { result, error } = await dbResultQuery<{ reportId: string }>(
    conn,
    sql,
    [
      appointmentId,
      visitTime,
      dogWeightKg,
      dogBodyConditioningScore,
      dogDidDonateBlood,
      dogHeartworm,
      dogDea1Point1,
      ineligibilityStatus,
      encryptedIneligibilityReason,
      ineligibilityExpiryTime,
    ],
  );
  if (error === CODE.DB_QUERY_FAILURE) {
    return Err(CODE.STORAGE_FAILURE);
  }
  if (result.rows.length !== 1) {
    return Err(CODE.STORAGE_FAILURE);
  }
  const { reportId } = result.rows[0];
  return Ok({ reportId });
}
