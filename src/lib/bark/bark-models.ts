import { z } from "zod";
import { DOG_GENDER, PosNegNil, ReportedIneligibility } from "../data/db-enums";

export type BarkAppointment = {
  appointmentId: string;
  vetId: string;
  dogId: string;
  dogName: string;
  dogBreed: string;
  dogGender: typeof DOG_GENDER.MALE | typeof DOG_GENDER.FEMALE;
  ownerName: string;
};

// TODO: Useful to define all models as Zod schemas. Reorganise these models accordingly.
export const EncryptedBarkAppointmentSchema = z.object({
  appointmentId: z.string(),
  vetId: z.string(),
  dogId: z.string(),
  dogEncryptedOii: z.string(),
  dogBreed: z.string(),
  dogGender: z.enum([DOG_GENDER.MALE, DOG_GENDER.FEMALE]),
  userEncryptedPii: z.string(),
});

export type EncryptedBarkAppointment = z.infer<
  typeof EncryptedBarkAppointmentSchema
>;

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

export type EncryptedBarkReportData = Omit<
  BarkReportData,
  "ineligibilityReason"
> & {
  encryptedIneligibilityReason: string;
};
