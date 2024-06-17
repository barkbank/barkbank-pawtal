import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { APPOINTMENT_STATUS } from "../enums/appointment-status";

/**
 * Updates an appointment status to REPORTED or CANCELLED.
 */
export async function updateAppointment(
  dbContext: DbContext,
  args: {
    appointmentId: string;
    appointmentStatus:
      | typeof APPOINTMENT_STATUS.REPORTED
      | typeof APPOINTMENT_STATUS.CANCELLED;
  },
): Promise<void> {
  const { appointmentId, appointmentStatus } = args;
  const sql = `
  UPDATE calls
  SET
    call_outcome = $2
  WHERE call_id = $1
  AND call_outcome = 'APPOINTMENT'
  RETURNING 1
  `;
  const res = await dbQuery(dbContext, sql, [appointmentId, appointmentStatus]);
  if (res.rows.length !== 1) {
    throw new Error(
      `Failed to update appointment status: ${JSON.stringify({ appointmentId, appointmentStatus })}`,
    );
  }
}
