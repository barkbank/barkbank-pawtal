import { Err, Ok, Result } from "@/lib/utilities/result";
import { CODE } from "@/lib/utilities/bark-code";
import { BarkReportData } from "../models/bark-report-data";
import { dbBegin, dbCommit, dbRelease, dbRollback } from "@/lib/data/db-utils";
import { selectAppointmentIds } from "../queries/select-appointment-ids";
import { insertReport } from "../queries/insert-report";
import { updateAppointment } from "../queries/update-appointment";
import { BarkContext } from "@/lib/bark/bark-context";
import { toEncryptedBarkReportData } from "../mappers/to-encrypted-bark-report-data";
import { APPOINTMENT_STATUS } from "../models/appointment-status";

/**
 * Submits a medical report for a specified appointment and progresses that
 * appointment's status to REPORTED.
 */
export async function opSubmitReport(
  context: BarkContext,
  args: {
    appointmentId: string;
    reportData: BarkReportData;
    actorVetId: string;
  },
): Promise<
  Result<
    { reportId: string },
    | typeof CODE.ERROR_APPOINTMENT_NOT_FOUND
    | typeof CODE.ERROR_NOT_ALLOWED
    | typeof CODE.FAILED
  >
> {
  const { dbPool } = context;
  const { appointmentId, reportData, actorVetId } = args;
  const conn = await dbPool.connect();
  try {
    const encryptedReportData = await toEncryptedBarkReportData(
      context,
      reportData,
    );

    await dbBegin(conn);
    const ids = await selectAppointmentIds(conn, {
      appointmentId,
    });
    if (ids === null) {
      return Err(CODE.ERROR_APPOINTMENT_NOT_FOUND);
    }
    if (ids.vetId !== actorVetId) {
      return Err(CODE.ERROR_NOT_ALLOWED);
    }
    const { reportId } = await insertReport(conn, {
      appointmentId,
      encryptedReportData,
    });
    await updateAppointment(conn, {
      appointmentId,
      appointmentStatus: APPOINTMENT_STATUS.REPORTED,
    });
    await dbCommit(conn);
    return Ok({ reportId });
  } catch (err) {
    console.error(err);
    await dbRollback(conn);
    return Err(CODE.FAILED);
  } finally {
    await dbRelease(conn);
  }
}
