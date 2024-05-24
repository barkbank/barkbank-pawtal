import { Err, Result } from "@/lib/utilities/result";
import { CODE } from "@/lib/utilities/bark-code";
import { PgBarkServiceConfig } from "../pg-bark-service";
import { BarkReportData } from "@/lib/bark/bark-models";

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
  return Err(CODE.ERROR_APPOINTMENT_NOT_FOUND);
}
