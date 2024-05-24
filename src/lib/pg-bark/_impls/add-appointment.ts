import { Err, Ok, Result } from "@/lib/utilities/result";
import { CODE } from "@/lib/utilities/bark-code";
import { PgBarkServiceConfig } from "../pg-bark-service";
import {
  dbBegin,
  dbCommit,
  dbRelease,
  dbResultQuery,
  dbRollback,
} from "@/lib/data/db-utils";
import { loadSql } from "../_sql/load-sql";
import { PoolClient } from "pg";

export async function addAppointment(
  config: PgBarkServiceConfig,
  args: {
    dogId: string;
    vetId: string;
  },
): Promise<
  Result<
    { appointmentId: string },
    | typeof CODE.ERROR_DOG_NOT_FOUND
    | typeof CODE.ERROR_VET_NOT_FOUND
    | typeof CODE.ERROR_NOT_PREFERRED_VET
    | typeof CODE.ERROR_APPOINTMENT_ALREADY_EXISTS
    | typeof CODE.STORAGE_FAILURE
  >
> {
  const conn = await config.dbPool.connect();
  const { dogId, vetId } = args;
  const ctx: _Context = { conn, dogId, vetId };
  try {
    await dbBegin(conn);
    const checkRes = await checkCanSchedule(ctx);
    if (checkRes !== CODE.OK) {
      return Err(checkRes);
    }
    const { result, error } = await insertAppointment(ctx);
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

type _Context = { conn: PoolClient; dogId: string; vetId: string };

async function checkCanSchedule(args: {
  conn: PoolClient;
  dogId: string;
  vetId: string;
}): Promise<
  | typeof CODE.OK
  | typeof CODE.ERROR_DOG_NOT_FOUND
  | typeof CODE.ERROR_VET_NOT_FOUND
  | typeof CODE.ERROR_NOT_PREFERRED_VET
  | typeof CODE.ERROR_APPOINTMENT_ALREADY_EXISTS
  | typeof CODE.STORAGE_FAILURE
> {
  const { conn, dogId, vetId } = args;
  const sql = loadSql("select-can-schedule");
  const { result, error } = await dbResultQuery<{
    dogExists: boolean;
    vetExists: boolean;
    isPreferredVet: boolean;
    hasExistingAppointment: boolean;
  }>(conn, sql, [dogId, vetId]);
  if (error === CODE.DB_QUERY_FAILURE) {
    return CODE.STORAGE_FAILURE;
  }
  if (result.rows.length !== 1) {
    return CODE.STORAGE_FAILURE;
  }
  const { dogExists, vetExists, isPreferredVet, hasExistingAppointment } =
    result.rows[0];
  if (!dogExists) {
    return CODE.ERROR_DOG_NOT_FOUND;
  }
  if (!vetExists) {
    return CODE.ERROR_VET_NOT_FOUND;
  }
  if (!isPreferredVet) {
    return CODE.ERROR_NOT_PREFERRED_VET;
  }
  if (hasExistingAppointment) {
    return CODE.ERROR_APPOINTMENT_ALREADY_EXISTS;
  }
  return CODE.OK;
}

async function insertAppointment(args: {
  conn: PoolClient;
  dogId: string;
  vetId: string;
}): Promise<Result<{ appointmentId: string }, typeof CODE.STORAGE_FAILURE>> {
  const { conn, dogId, vetId } = args;
  const sql = loadSql("insert-appointment");
  const { result, error } = await dbResultQuery<{ appointmentId: string }>(
    conn,
    sql,
    [dogId, vetId],
  );
  if (error === CODE.DB_QUERY_FAILURE) {
    return Err(CODE.STORAGE_FAILURE);
  }
  if (result.rows.length !== 1) {
    return Err(CODE.STORAGE_FAILURE);
  }
  const { appointmentId } = result.rows[0];
  return Ok({ appointmentId });
}
