import { z } from "zod";
import { BarkReportData, BarkReportDataSchema } from "./bark-report-data";
import { BarkReportMetadataSchema } from "./bark-report-metadata";
import { DogIdInfoSchema } from "./dog-id-info";
import { VetContactDetailsSchema } from "./vet-contact-details";
import { POS_NEG_NIL, PosNegNilSchema } from "../enums/pos-neg-nil";
import {
  REPORTED_INELIGIBILITY,
  ReportedIneligibilitySchema,
} from "../enums/reported-ineligibility";
import { DogGenderSchema } from "../enums/dog-gender";
import {
  parseCommonDate,
  SINGAPORE_TIME_ZONE,
} from "@/lib/utilities/bark-time";
import { EncryptedBarkReportData } from "./encrypted-bark-report-data";
import { MILLIS_PER_WEEK } from "@/lib/utilities/bark-millis";

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

// WIP: Remove this function and remove unused imports
function _mockEncryptedReportSpec() {
  const spec: EncryptedReportSpec = {
    callId: "Must Override",
    dogId: "Must Override",
    vetId: "Must Override",
    visitTime: parseCommonDate("8 Mar 2022", SINGAPORE_TIME_ZONE),
    dogWeightKg: 26.5,
    dogBodyConditioningScore: 5,
    dogHeartworm: POS_NEG_NIL.NEGATIVE,
    dogDea1Point1: POS_NEG_NIL.NEGATIVE,
    ineligibilityStatus: REPORTED_INELIGIBILITY.NIL,
    encryptedIneligibilityReason: "",
    ineligibilityExpiryTime: null,
    dogDidDonateBlood: true,
  };
}

// WIP: Remove this function and remove unused imports
function _mockEncryptedBarkReportData(): EncryptedBarkReportData {
  return {
    visitTime: new Date(Date.now() - MILLIS_PER_WEEK),
    dogWeightKg: 25,
    dogBodyConditioningScore: 9,
    dogHeartworm: POS_NEG_NIL.NEGATIVE,
    dogDea1Point1: POS_NEG_NIL.NEGATIVE,
    ineligibilityStatus: REPORTED_INELIGIBILITY.NIL,
    encryptedIneligibilityReason: "",
    ineligibilityExpiryTime: null,
    dogDidDonateBlood: true,
  };
}

// WIP: Remove this function and remove unused imports
function _mockReportData(): BarkReportData {
  return {
    visitTime: new Date(Date.now() - MILLIS_PER_WEEK),
    dogWeightKg: 25,
    dogBodyConditioningScore: 9,
    dogHeartworm: POS_NEG_NIL.NEGATIVE,
    dogDea1Point1: POS_NEG_NIL.NEGATIVE,
    ineligibilityStatus: REPORTED_INELIGIBILITY.NIL,
    ineligibilityReason: "",
    ineligibilityExpiryTime: null,
    dogDidDonateBlood: true,
  };
}
