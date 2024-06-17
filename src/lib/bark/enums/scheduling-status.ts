import { z } from "zod";

export const SCHEDULING_STATUS = {
  PENDING_APPOINTMENT: "PENDING_APPOINTMENT",
  PENDING_REPORT: "PENDING_REPORT",
  UNAVAILABLE: "UNAVAILABLE",
} as const;

export const SchedulingStatusSchema = z.nativeEnum(SCHEDULING_STATUS);

export type SchedulingStatus = z.infer<typeof SchedulingStatusSchema>;
