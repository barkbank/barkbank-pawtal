import { z } from "zod";
import { BarkReportDataSchema } from "./bark-report-data";

export const BarkReportSchema = BarkReportDataSchema.extend({
  reportId: z.string(),
  reportCreationTime: z.date(),
  reportModificationTime: z.date(),
  appointmentId: z.string(),
  dogId: z.string(),
  vetId: z.string(),
});

export type BarkReport = z.infer<typeof BarkReportSchema>;
