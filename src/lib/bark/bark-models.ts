import { BarkReportData } from "./models/bark-report-data";

export type BarkReport = BarkReportData & {
  reportId: string;
  reportCreationTime: Date;
  reportModificationTime: Date;
  appointmentId: string;
  dogId: string;
  vetId: string;
};

export type EncryptedBarkReport = Omit<BarkReport, "ineligibilityReason"> & {
  encryptedIneligibilityReason: string;
};
