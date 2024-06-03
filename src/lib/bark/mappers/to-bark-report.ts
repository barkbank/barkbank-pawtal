import { BarkContext } from "../bark-context";
import { EncryptedBarkReport } from "../models/encrypted-bark-report";
import { BarkReport } from "../models/bark-report";
import { toIneligibilityReason } from "./to-ineligibility-reason";
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
    toIneligibilityReason(context, encryptedIneligibilityReason),
    toDogName(context, dogEncryptedOii),
    toOwnerName(context, userEncryptedPii),
  ]);
  const report = {
    ...otherFields,
    ineligibilityReason,
    dogName,
    ownerName,
  };
  return report;
}
