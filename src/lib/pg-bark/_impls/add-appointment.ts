import { Err, Ok, Result } from "@/lib/utilities/result";
import { CODE } from "@/lib/utilities/bark-code";
import { PgBarkServiceConfig } from "../pg-bark-service";
import { dbBegin, dbRelease, dbResultQuery } from "@/lib/data/db-utils";
import { checkPreferredVet } from "../_checks/check-preferred-vet";
import { loadSql } from "../_sql/load-sql";

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
  try {
    await dbBegin(conn);
    const res1 = await checkPreferredVet({ conn, dogId, vetId });
    if (res1 !== CODE.OK) {
      return Err(res1);
    }
    const sql = loadSql("add-appointment");
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
  } finally {
    await dbRelease(conn);
  }
  return Err(CODE.ERROR_DOG_NOT_FOUND);
}
