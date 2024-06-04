import { BarkContext } from "../bark-context";
import { EncryptedBarkReportData } from "../models/encrypted-bark-report-data";
import { BarkReportData } from "../models/bark-report-data";
import { toEncryptedText } from "./to-encrypted-text";

export async function toEncryptedBarkReportData(
  context: BarkContext,
  reportData: BarkReportData,
): Promise<EncryptedBarkReportData> {
  const { ineligibilityReason, ...otherFields } = reportData;
  const encryptedIneligibilityReason = await toEncryptedText(
    context,
    ineligibilityReason,
  );
  const encryptedReportData: EncryptedBarkReportData = {
    ...otherFields,
    encryptedIneligibilityReason,
  };
  return encryptedReportData;
}
