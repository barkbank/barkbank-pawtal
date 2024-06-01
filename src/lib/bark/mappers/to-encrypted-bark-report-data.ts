import { BarkContext } from "../bark-context";
import { EncryptedBarkReportData } from "../bark-models";
import { BarkReportData } from "../models/bark-report-data";

export async function toEncryptedBarkReportData(
  context: BarkContext,
  reportData: BarkReportData,
): Promise<EncryptedBarkReportData> {
  const { textEncryptionService } = context;
  const { ineligibilityReason, ...otherFields } = reportData;
  const encryptedIneligibilityReason =
    ineligibilityReason === ""
      ? ""
      : await textEncryptionService.getEncryptedData(ineligibilityReason);
  const encryptedReportData: EncryptedBarkReportData = {
    ...otherFields,
    encryptedIneligibilityReason,
  };
  return encryptedReportData;
}
