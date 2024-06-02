import { BarkReport } from "./models/bark-report";

export type EncryptedBarkReport = Omit<BarkReport, "ineligibilityReason"> & {
  encryptedIneligibilityReason: string;
};
