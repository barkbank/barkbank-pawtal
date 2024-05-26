import { Err, Ok, Result } from "@/lib/utilities/result";
import { CODE } from "@/lib/utilities/bark-code";
import { PgBarkServiceConfig } from "../pg-bark-service";
import { BarkReportData } from "@/lib/bark/bark-models";
import { dbBegin, dbCommit, dbRelease, dbRollback } from "@/lib/data/db-utils";
import { selectPendingAppointmentExists } from "../_queries/select-pending-appointment-exists";
import { insertReport } from "../_queries/insert-report";
import { updateAppointment } from "../_queries/update-appointment";
import { CALL_OUTCOME } from "@/lib/data/db-enums";

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
  const { dbPool, textEncryptionService } = config;
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
