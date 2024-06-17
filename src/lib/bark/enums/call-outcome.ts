import { z } from "zod";

export const CALL_OUTCOME = {
  APPOINTMENT: "APPOINTMENT",
  DECLINED: "DECLINED",
  OPT_OUT: "OPT_OUT",
  REPORTED: "REPORTED",
  CANCELLED: "CANCELLED",
} as const;

export const CallOutcomeSchema = z.nativeEnum(CALL_OUTCOME);

export type CallOutcome = z.infer<typeof CallOutcomeSchema>;
