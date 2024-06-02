import { z } from "zod";

/**
 * All of the IDs and timestamps of a report.
 */
export const BarkReportMetadataSchema = z.object({
  reportId: z.string(),
  reportCreationTime: z.date(),
  reportModificationTime: z.date(),
  appointmentId: z.string(),
  dogId: z.string(),
  vetId: z.string(),
});
