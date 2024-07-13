import { EncryptedReportFields } from "@/lib/bark/models/encrypted-report-fields";
import { withBarkContext } from "../_context";
import { toReEncryptedReportFields } from "@/lib/bark/mappers/to-re-encrypted-report-fields";
import { toEncryptedText } from "@/lib/bark/mappers/to-encrypted-text";
import { toDecryptedText } from "@/lib/bark/mappers/to-decrypted-text";

describe("toReEncryptedReportFields", () => {
  it("should leave empty string alone", async () => {
    await withBarkContext(async ({ context }) => {
      const fields: EncryptedReportFields = {
        reportId: "123",
        encryptedIneligibilityReason: "",
      };
      const reEncrypted = await toReEncryptedReportFields(context, fields);
      expect(reEncrypted.reportId).toEqual("123");
      expect(reEncrypted.encryptedIneligibilityReason).toEqual("");
    });
  });
  it("should reencrypt ineligibility reason", async () => {
    await withBarkContext(async ({ context }) => {
      const text = "Hello Panda";
      const encText = await toEncryptedText(context, text);
      const fields: EncryptedReportFields = {
        reportId: "123",
        encryptedIneligibilityReason: encText,
      };
      const reEncrypted = await toReEncryptedReportFields(context, fields);
      expect(reEncrypted.reportId).toEqual(fields.reportId);
      expect(reEncrypted.encryptedIneligibilityReason).not.toEqual(
        fields.encryptedIneligibilityReason,
      );
      const decText = await toDecryptedText(
        context,
        reEncrypted.encryptedIneligibilityReason,
      );
      expect(decText).toEqual(text);
    });
  });
});
