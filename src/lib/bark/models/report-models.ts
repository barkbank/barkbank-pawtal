import { z } from "zod";
import { BarkReportDataSchema } from "./bark-report-data";
import { BarkReportMetadataSchema } from "./bark-report-metadata";
import { DogIdInfoSchema } from "./dog-id-info";
import { VetContactDetailsSchema } from "./vet-contact-details";
import { PosNegNilSchema } from "../enums/pos-neg-nil";
import { ReportedIneligibilitySchema } from "../enums/reported-ineligibility";
import { DogGenderSchema } from "../enums/dog-gender";

export const BarkReportSchema = z
  .object({})
  .merge(BarkReportDataSchema)
  .merge(BarkReportMetadataSchema)
  .merge(DogIdInfoSchema)
  .merge(VetContactDetailsSchema);

export const ReportSchema = z.object({
  reportId: z.string(),
  callId: z.string(),
  dogId: z.string(),
  vetId: z.string(),
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

export const EncryptedReportSchema = ReportSchema.omit({
  ineligibilityReason: true,
}).merge(
  z.object({
    encryptedIneligibilityReason: z.string(),
  }),
);

export const EncryptedReportSpecSchema = EncryptedReportSchema.omit({
  reportId: true,
});

export type BarkReport = z.infer<typeof BarkReportSchema>;
export type Report = z.infer<typeof ReportSchema>;
export type EncryptedReport = z.infer<typeof EncryptedReportSchema>;
export type EncryptedReportSpec = z.infer<typeof EncryptedReportSpecSchema>;
