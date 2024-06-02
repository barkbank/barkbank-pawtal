import { z } from "zod";
import { BarkReportSchema } from "./bark-report";

export const EncryptedBarkReportSchema = BarkReportSchema.omit({
  ineligibilityReason: true,
}).extend({
  encryptedIneligibilityReason: z.string(),
});

export type EncryptedBarkReport = z.infer<typeof EncryptedBarkReportSchema>;
