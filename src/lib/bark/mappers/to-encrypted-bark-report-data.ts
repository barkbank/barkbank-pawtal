import { BarkContext } from "../bark-context";
import { BarkReportData, EncryptedBarkReportData } from "../bark-models";

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
