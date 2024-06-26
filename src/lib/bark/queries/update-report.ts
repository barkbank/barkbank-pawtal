import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  EncryptedBarkReportData,
  EncryptedBarkReportDataSchema,
} from "../models/encrypted-bark-report-data";

export async function updateReport(
  dbContext: DbContext,
  args: {
    reportId: string;
    encryptedReportData: EncryptedBarkReportData;
  },
): Promise<{ numUpdated: number }> {
  const { reportId, encryptedReportData } = args;
  const validatedData =
    EncryptedBarkReportDataSchema.parse(encryptedReportData);
  const {
    visitTime,
    dogWeightKg,
    dogBodyConditioningScore,
    dogHeartworm,
    dogDea1Point1,
    ineligibilityStatus,
    encryptedIneligibilityReason,
    ineligibilityExpiryTime,
    dogDidDonateBlood,
  } = validatedData;
  const sql = `
  UPDATE reports
  SET
    visit_time = $2,
    dog_weight_kg = $3,
    dog_body_conditioning_score = $4,
    dog_heartworm = $5,
    dog_dea1_point1 = $6,
    dog_reported_ineligibility = $7,
    encrypted_ineligibility_reason = $8,
    ineligibility_expiry_time = $9,
    dog_did_donate_blood = $10
  WHERE report_id = $1
  RETURNING 1
  `;
  const res = await dbQuery(dbContext, sql, [
    reportId,
    visitTime,
    dogWeightKg,
    dogBodyConditioningScore,
    dogHeartworm,
    dogDea1Point1,
    ineligibilityStatus,
    encryptedIneligibilityReason,
    ineligibilityExpiryTime,
    dogDidDonateBlood,
  ]);
  const numUpdated = res.rows.length;
  return { numUpdated };
}
