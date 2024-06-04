import { z } from "zod";
import { BarkReportDataSchema } from "./bark-report-data";
import { BarkReportMetadataSchema } from "./bark-report-metadata";
import { DogIdInfoSchema } from "./dog-id-info";

export const BarkReportSchema = BarkReportDataSchema.merge(
  BarkReportMetadataSchema,
).merge(DogIdInfoSchema);

export type BarkReport = z.infer<typeof BarkReportSchema>;
