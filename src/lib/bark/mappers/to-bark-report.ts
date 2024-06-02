import { BarkContext } from "../bark-context";
import { EncryptedBarkReport } from "../bark-models";
import { BarkReport } from "../models/bark-report";

export async function toBarkReport(
  context: BarkContext,
  encrypted: EncryptedBarkReport,
): Promise<BarkReport> {
  const { textEncryptionService } = context;
  const { encryptedIneligibilityReason, ...otherFields } = encrypted;
  const ineligibilityReason =
    encryptedIneligibilityReason === ""
      ? ""
      : await textEncryptionService.getDecryptedData(
          encryptedIneligibilityReason,
        );
  const report = {
    ...otherFields,
    ineligibilityReason,
  };
  return report;
}
