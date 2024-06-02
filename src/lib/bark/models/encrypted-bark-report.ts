import { z } from "zod";
import { EncryptedBarkReportDataSchema } from "./encrypted-bark-report-data";
import { BarkReportMetadataSchema } from "./bark-report-metadata";

export const EncryptedBarkReportSchema = EncryptedBarkReportDataSchema.merge(
  BarkReportMetadataSchema,
);

export type EncryptedBarkReport = z.infer<typeof EncryptedBarkReportSchema>;
