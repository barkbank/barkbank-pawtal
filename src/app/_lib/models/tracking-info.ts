import { z } from "zod";

export const TrackingInfoSchema = z.object({
  pathname: z.string(),
});

export type TrackingInfo = z.infer<typeof TrackingInfoSchema>;
