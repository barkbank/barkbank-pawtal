import { z } from "zod";
import { BarkReportDataSchema } from "./bark-report-data";

/**
 * The encrypted form of BarkReportData replaces ineligibilityReason with
 * encryptedIneligibilityReason.
 */
export const EncryptedBarkReportDataSchema = BarkReportDataSchema.omit({
  ineligibilityReason: true,
}).extend({
  encryptedIneligibilityReason: z.string(),
});

// TODO: Rename this to EncryptedReportSpec and move report-models.ts
export type EncryptedBarkReportData = z.infer<
  typeof EncryptedBarkReportDataSchema
>;
