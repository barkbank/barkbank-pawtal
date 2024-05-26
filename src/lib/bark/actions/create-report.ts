import { Err, Ok, Result } from "@/lib/utilities/result";
import { CODE } from "@/lib/utilities/bark-code";
import { BarkReportData } from "@/lib/bark/bark-models";
import { dbBegin, dbCommit, dbRelease, dbRollback } from "@/lib/data/db-utils";
import { selectPendingAppointmentExists } from "../queries/select-pending-appointment-exists";
import { insertReport } from "../queries/insert-report";
import { updateAppointment } from "../queries/update-appointment";
import { CALL_OUTCOME } from "@/lib/data/db-enums";
import { BarkContext } from "@/lib/bark/bark-context";

export async function BarkAction_createReport(
  context: BarkContext,
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
  const { dbPool, textEncryptionService } = context;
  const { appointmentId, reportData } = args;
  const { ineligibilityReason, ...otherFields } = reportData;
  const conn = await dbPool.connect();
  try {
    const encryptedIneligibilityReason =
      await textEncryptionService.getEncryptedData(ineligibilityReason);
    await dbBegin(conn);
    const { exists } = await selectPendingAppointmentExists(conn, {
      appointmentId,
    });
    if (!exists) {
      return Err(CODE.ERROR_APPOINTMENT_NOT_FOUND);
    }
    const { reportId } = await insertReport(conn, {
      appointmentId,
      encryptedIneligibilityReason,
      ...otherFields,
    });
    await updateAppointment(conn, {
      appointmentId,
      appointmentStatus: CALL_OUTCOME.REPORTED,
    });
    await dbCommit(conn);
    return Ok({ reportId });
  } catch (e) {
    console.error(e);
    await dbRollback(conn);
    return Err(CODE.STORAGE_FAILURE);
  } finally {
    await dbRelease(conn);
  }
}
