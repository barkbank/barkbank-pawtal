import { CODE } from "@/lib/utilities/bark-code";
import { BarkContext } from "../bark-context";
import { dbBegin, dbCommit, dbRelease, dbRollback } from "@/lib/data/db-utils";
import { updateAppointment } from "../queries/update-appointment";
import { APPOINTMENT_STATUS } from "../models/appointment-status";
import { selectAppointmentMetadata } from "../queries/select-appointment-metadata";

export async function opCancelAppointment(
  context: BarkContext,
  args: { appointmentId: string; actorVetId: string },
): Promise<
  | typeof CODE.OK
  | typeof CODE.ERROR_APPOINTMENT_NOT_FOUND
  | typeof CODE.ERROR_NOT_ALLOWED
  | typeof CODE.ERROR_APPOINTMENT_IS_NOT_PENDING
  | typeof CODE.FAILED
> {
  const { dbPool } = context;
  const { appointmentId, actorVetId } = args;
  const conn = await dbPool.connect();
  try {
    await dbBegin(conn);
    const res = await selectAppointmentMetadata(conn, { appointmentId });
    if (res === null) {
      return CODE.ERROR_APPOINTMENT_NOT_FOUND;
    }
    if (res.vetId !== actorVetId) {
      return CODE.ERROR_NOT_ALLOWED;
    }
    if (res.appointmentStatus !== APPOINTMENT_STATUS.PENDING) {
      return CODE.ERROR_APPOINTMENT_IS_NOT_PENDING;
    }
    await updateAppointment(conn, {
      appointmentId,
      appointmentStatus: APPOINTMENT_STATUS.CANCELLED,
    });
    await dbCommit(conn);
    return CODE.OK;
  } catch (err) {
    console.log(err);
    await dbRollback(conn);
    return CODE.FAILED;
  } finally {
    await dbRelease(conn);
  }
}
