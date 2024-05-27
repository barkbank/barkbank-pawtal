import {
  BarkReportData,
  EncryptedBarkReportData,
} from "@/lib/bark/bark-models";
import { CODE } from "@/lib/utilities/bark-code";
import { BarkContext } from "../bark-context";
import { updateReport } from "../queries/update-report";

export async function opEditReport(
  context: BarkContext,
  args: { reportId: string; reportData: BarkReportData },
): Promise<
  typeof CODE.OK | typeof CODE.ERROR_REPORT_NOT_FOUND | typeof CODE.FAILED
> {
  const { dbPool, textEncryptionService } = context;
  const { reportId, reportData } = args;
  const { ineligibilityReason, ...otherFields } = reportData;
  try {
    const encryptedIneligibilityReason =
      await textEncryptionService.getEncryptedData(ineligibilityReason);
    const encryptedReportData: EncryptedBarkReportData = {
      ...otherFields,
      encryptedIneligibilityReason,
    };
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
