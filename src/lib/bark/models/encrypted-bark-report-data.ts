import { BarkReportData } from "./bark-report-data";

export type EncryptedBarkReportData = Omit<
  BarkReportData,
  "ineligibilityReason"
> & {
  encryptedIneligibilityReason: string;
};
