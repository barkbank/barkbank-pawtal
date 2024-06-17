import { z } from "zod";

export const REPORTED_INELIGIBILITY = {
  NIL: "NIL",
  TEMPORARILY_INELIGIBLE: "TEMPORARILY_INELIGIBLE",
  PERMANENTLY_INELIGIBLE: "PERMANENTLY_INELIGIBLE",
} as const;

export const ReportedIneligibilitySchema = z.nativeEnum(REPORTED_INELIGIBILITY);

export type ReportedIneligibility = z.infer<typeof ReportedIneligibilitySchema>;
