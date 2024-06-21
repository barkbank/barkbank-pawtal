import { BarkContext } from "../bark-context";
import { EncryptedBarkReport } from "../models/encrypted-bark-report";
import { BarkReport, BarkReportSchema } from "../models/bark-report";
import { toDecryptedText } from "./to-decrypted-text";
import { toOwnerName } from "./to-owner-name";
import { toDogName } from "./to-dog-name";

export async function toBarkReport(
  context: BarkContext,
  encrypted: EncryptedBarkReport,
): Promise<BarkReport> {
  const {
    encryptedIneligibilityReason,
    dogEncryptedOii,
    userEncryptedPii,
    ...otherFields
  } = encrypted;
  const [ineligibilityReason, dogName, ownerName] = await Promise.all([
    toDecryptedText(context, encryptedIneligibilityReason),
    toDogName(context, dogEncryptedOii),
    toOwnerName(context, userEncryptedPii),
  ]);
  const report: BarkReport = {
    ...otherFields,
    ineligibilityReason,
    dogName,
    ownerName,
  };
  return BarkReportSchema.parse(report);
}
