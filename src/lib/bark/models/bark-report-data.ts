import {
  PosNegNilSchema,
  ReportedIneligibilitySchema,
} from "@/lib/data/db-enums";
import { z } from "zod";

/**
 * The data part of a report. These are values provided by a vet.
 */
export const BarkReportDataSchema = z.object({
  visitTime: z.date(),
  dogWeightKg: z.number(),

  // BCS score range is 1-9 https://vcahospitals.com/know-your-pet/body-condition-scores
  dogBodyConditioningScore: z.number().min(1).max(9),

  dogHeartworm: PosNegNilSchema,
  dogDea1Point1: PosNegNilSchema,
  ineligibilityStatus: ReportedIneligibilitySchema,
  ineligibilityReason: z.string(),
  ineligibilityExpiryTime: z.date().nullable(),
  dogDidDonateBlood: z.boolean(),
});

export type BarkReportData = z.infer<typeof BarkReportDataSchema>;
