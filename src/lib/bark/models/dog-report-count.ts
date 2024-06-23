import { z } from "zod";

export const DogReportCountSchema = z.object({
  numReports: z.number().nonnegative(),
});

export type DogReportCount = z.infer<typeof DogReportCountSchema>;
