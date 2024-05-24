import { Err, Result } from "@/lib/utilities/result";
import { CODE } from "@/lib/utilities/bark-code";
import { PgBarkServiceConfig } from "../pg-bark-service";
import { BarkReportData } from "@/lib/bark/bark-models";
import { PoolClient } from "pg";
import { DogMapper } from "@/lib/data/dog-mapper";
import {
  dbBegin,
  dbCommit,
  dbRelease,
  dbResultQuery,
  dbRollback,
} from "@/lib/data/db-utils";
import { loadSql } from "../_sql/load-sql";

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
  const { dbPool, dogMapper } = config;
  const { appointmentId, reportData } = args;
  const conn = await dbPool.connect();
  const ctx: _Context = { conn, dogMapper, appointmentId };
  try {
    await dbBegin(conn);
    const checkResult = await checkAppointmentExists(ctx);
    if (checkResult !== CODE.OK) {
      return Err(checkResult);
    }
    await dbCommit(conn);
    return Err(CODE.STORAGE_FAILURE);
  } catch {
    await dbRollback(conn);
    return Err(CODE.STORAGE_FAILURE);
  } finally {
    await dbRelease(conn);
  }
}

type _Context = {
  conn: PoolClient;
  dogMapper: DogMapper;
  appointmentId: string;
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
