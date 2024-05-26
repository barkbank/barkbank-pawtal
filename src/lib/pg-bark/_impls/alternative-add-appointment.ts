import { Err, Ok, Result } from "@/lib/utilities/result";
import { CODE } from "@/lib/utilities/bark-code";
import { PgBarkServiceConfig } from "../pg-bark-service";
import { dbBegin, dbCommit, dbRelease, dbRollback } from "@/lib/data/db-utils";
import { selectAppointmentSituation } from "../_queries/select-appointment-situation";
import { insertAppointment } from "../_queries/insert-appointment";

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
    const stats = await selectAppointmentSituation(conn, { dogId, vetId });
    if (!stats.dogExists) {
      return Err(CODE.ERROR_DOG_NOT_FOUND);
    }
    if (!stats.vetExists) {
      return Err(CODE.ERROR_VET_NOT_FOUND);
    }
    if (!stats.isPreferredVet) {
      return Err(CODE.ERROR_NOT_PREFERRED_VET);
    }
    if (stats.hasExistingAppointment) {
      return Err(CODE.ERROR_APPOINTMENT_ALREADY_EXISTS);
    }
    const result = await insertAppointment(conn, { dogId, vetId });
    await dbCommit(conn);
    return Ok(result);
  } catch {
    await dbRollback(conn);
    return Err(CODE.STORAGE_FAILURE);
  } finally {
    await dbRelease(conn);
  }
}
