import { z } from "zod";
import { EncryptedBarkReportDataSchema } from "./encrypted-bark-report-data";
import { BarkReportMetadataSchema } from "./bark-report-metadata";
import { EncryptedDogIdInfoSchema } from "./encrypted-dog-id-info";
import { VetContactDetailsSchema } from "./vet-contact-details";

export const EncryptedBarkReportSchema = z
  .object({})
  .merge(EncryptedBarkReportDataSchema)
  .merge(BarkReportMetadataSchema)
  .merge(EncryptedDogIdInfoSchema)
  .merge(VetContactDetailsSchema);

export type EncryptedBarkReport = z.infer<typeof EncryptedBarkReportSchema>;
