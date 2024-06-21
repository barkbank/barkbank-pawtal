import { z } from "zod";
import { BarkReportDataSchema } from "./bark-report-data";
import { BarkReportMetadataSchema } from "./bark-report-metadata";
import { DogIdInfoSchema } from "./dog-id-info";
import { VetContactDetailsSchema } from "./vet-contact-details";

export const BarkReportSchema = z
  .object({})
  .merge(BarkReportDataSchema)
  .merge(BarkReportMetadataSchema)
  .merge(DogIdInfoSchema)
  .merge(VetContactDetailsSchema);

export type BarkReport = z.infer<typeof BarkReportSchema>;
