import { z } from "zod";

export const MEDICAL_STATUS = {
  UNKNOWN: "UNKNOWN",
  PERMANENTLY_INELIGIBLE: "PERMANENTLY_INELIGIBLE",
  TEMPORARILY_INELIGIBLE: "TEMPORARILY_INELIGIBLE",
  ELIGIBLE: "ELIGIBLE",
} as const;

export const MedicalStatusSchema = z.nativeEnum(MEDICAL_STATUS);

export type MedicalStatus = z.infer<typeof MedicalStatusSchema>;
