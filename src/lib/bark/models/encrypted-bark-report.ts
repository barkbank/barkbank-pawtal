import { z } from "zod";
import { EncryptedBarkReportDataSchema } from "./encrypted-bark-report-data";
import { BarkReportMetadataSchema } from "./bark-report-metadata";
import { EncryptedDogIdInfoSchema } from "./encrypted-dog-id-info";

export const EncryptedBarkReportSchema = EncryptedBarkReportDataSchema.merge(
  BarkReportMetadataSchema,
).merge(EncryptedDogIdInfoSchema);

export type EncryptedBarkReport = z.infer<typeof EncryptedBarkReportSchema>;
