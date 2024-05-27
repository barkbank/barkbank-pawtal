import { BarkReportData } from "@/lib/bark/bark-models";
import { CODE } from "@/lib/utilities/bark-code";
import { BarkContext } from "../bark-context";
import { updateReport } from "../queries/update-report";
import { toEncryptedBarkReportData } from "../mappers/to-encrypted-bark-report-data";

export async function opEditReport(
  context: BarkContext,
  args: { reportId: string; reportData: BarkReportData },
): Promise<
  typeof CODE.OK | typeof CODE.ERROR_REPORT_NOT_FOUND | typeof CODE.FAILED
> {
  const { dbPool } = context;
  const { reportId, reportData } = args;
  try {
    const encryptedReportData = await toEncryptedBarkReportData(
      context,
      reportData,
    );
    const { numUpdated } = await updateReport(dbPool, {
      reportId,
      encryptedReportData,
    });
    if (numUpdated === 0) {
      return CODE.ERROR_REPORT_NOT_FOUND;
    }
    return CODE.OK;
  } catch (err) {
    console.error(err);
    return CODE.FAILED;
  }
}
