import { z } from "zod";

export const EncryptedReportFieldsSchema = z.object({
  reportId: z.string(),
  encryptedIneligibilityReason: z.string(),
});

export type EncryptedReportFields = z.infer<typeof EncryptedReportFieldsSchema>;
