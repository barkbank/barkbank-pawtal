import { z } from "zod";
import { BarkReportDataSchema } from "./bark-report-data";
import { BarkReportMetadataSchema } from "./bark-report-metadata";

export const BarkReportSchema = BarkReportDataSchema.merge(
  BarkReportMetadataSchema,
);

export type BarkReport = z.infer<typeof BarkReportSchema>;
