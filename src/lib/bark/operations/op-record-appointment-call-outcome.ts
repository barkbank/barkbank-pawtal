import { Err, Ok, Result } from "@/lib/utilities/result";
import { CODE } from "@/lib/utilities/bark-code";
import { dbBegin, dbCommit, dbRelease, dbRollback } from "@/lib/data/db-utils";
import { selectAppointmentSituation } from "../queries/select-appointment-situation";
import { insertAppointment } from "../queries/insert-appointment";
import { BarkContext } from "../bark-context";

/**
 * Records an APPOINTMENT call-outcome between a specified dog and vet.
 */
export async function opRecordAppointmentCallOutcome(
  context: BarkContext,
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
    | typeof CODE.FAILED
  >
> {
  const conn = await context.dbPool.connect();
  const { dogId, vetId } = args;
  try {
    await dbBegin(conn);
    const situation = await selectAppointmentSituation(conn, { dogId, vetId });
    if (!situation.dogExists) {
      return Err(CODE.ERROR_DOG_NOT_FOUND);
    }
    if (!situation.vetExists) {
      return Err(CODE.ERROR_VET_NOT_FOUND);
    }
    if (!situation.isPreferredVet) {
      return Err(CODE.ERROR_NOT_PREFERRED_VET);
    }
    if (situation.hasExistingAppointment) {
      return Err(CODE.ERROR_APPOINTMENT_ALREADY_EXISTS);
    }
    const result = await insertAppointment(conn, { dogId, vetId });
    await dbCommit(conn);
    return Ok(result);
  } catch (err) {
    console.error(err);
    await dbRollback(conn);
    return Err(CODE.FAILED);
  } finally {
    await dbRelease(conn);
  }
}
