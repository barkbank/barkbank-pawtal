import { BarkContext } from "../bark-context";
import {
  EncryptedReportFields,
  EncryptedReportFieldsSchema,
} from "../models/encrypted-report-fields";
import { toDecryptedText } from "./to-decrypted-text";
import { toEncryptedText } from "./to-encrypted-text";

export async function toReEncryptedReportFields(
  context: BarkContext,
  fields: EncryptedReportFields,
): Promise<EncryptedReportFields> {
  const text = await toDecryptedText(
    context,
    fields.encryptedIneligibilityReason,
  );
  const encText = await toEncryptedText(context, text);
  const out: EncryptedReportFields = {
    reportId: fields.reportId,
    encryptedIneligibilityReason: encText,
  };
  return EncryptedReportFieldsSchema.parse(out);
}
