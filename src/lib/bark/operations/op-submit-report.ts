import { Err, Ok, Result } from "@/lib/utilities/result";
import { CODE } from "@/lib/utilities/bark-code";
import { BarkReportData } from "../models/bark-report-data";
import { dbBegin, dbCommit, dbRelease, dbRollback } from "@/lib/data/db-utils";
import { selectAppointmentMetadata } from "../queries/select-appointment-metadata";
import { updateAppointment } from "../queries/update-appointment";
import { BarkContext } from "@/lib/bark/bark-context";
import { toEncryptedBarkReportData } from "../mappers/to-encrypted-bark-report-data";
import { APPOINTMENT_STATUS } from "../enums/appointment-status";
import { ReportDao } from "../daos/report-dao";

// TODO: Move this into a ReportService
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
    | typeof CODE.ERROR_APPOINTMENT_IS_NOT_PENDING
    | typeof CODE.FAILED
  >
> {
  const { dbPool } = context;
  const { appointmentId, reportData, actorVetId } = args;
  const dao = new ReportDao();
  const conn = await dbPool.connect();
  try {
    const encryptedReportData = await toEncryptedBarkReportData(
      context,
      reportData,
    );

    await dbBegin(conn);
    const res = await selectAppointmentMetadata(conn, {
      appointmentId,
    });
    if (res === null) {
      return Err(CODE.ERROR_APPOINTMENT_NOT_FOUND);
    }
    if (res.vetId !== actorVetId) {
      return Err(CODE.ERROR_NOT_ALLOWED);
    }
    if (res.appointmentStatus !== APPOINTMENT_STATUS.PENDING) {
      return Err(CODE.ERROR_APPOINTMENT_IS_NOT_PENDING);
    }
    const { reportId } = await dao.insert({
      callId: appointmentId,
      spec: encryptedReportData,
      db: conn,
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
