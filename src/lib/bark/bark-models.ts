import { PosNegNil, ReportedIneligibility } from "../data/db-enums";

export type BarkReportData = {
  visitTime: Date;
  dogWeightKg: number;
  dogBodyConditioningScore: number;
  dogHeartworm: PosNegNil;
  dogDea1Point1: PosNegNil;
  ineligibilityStatus: ReportedIneligibility;
  ineligibilityReason: string;
  ineligibilityExpiryTime: Date | null;
  dogDidDonateBlood: boolean;
};

export type BarkReport = BarkReportData & {
  callId: string;
  dogId: string;
  vetId: string;
};
