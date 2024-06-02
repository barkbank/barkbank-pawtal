import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { EncryptedBarkReport } from "../models/encrypted-bark-report";

export async function selectReport(
  dbContext: DbContext,
  args: { reportId: string },
): Promise<EncryptedBarkReport | null> {
  const { reportId } = args;
  const sql = `
  SELECT
    report_id as "reportId",
    report_creation_time as "reportCreationTime",
    report_modification_time as "reportModificationTime",

    call_id as "appointmentId",
    dog_id as "dogId",
    vet_id as "vetId",

    visit_time as "visitTime",

    dog_weight_kg as "dogWeightKg",
    dog_body_conditioning_score as "dogBodyConditioningScore",
    dog_heartworm as "dogHeartworm",
    dog_dea1_point1 as "dogDea1Point1",

    dog_did_donate_blood as "dogDidDonateBlood",

    dog_reported_ineligibility as "ineligibilityStatus",
    encrypted_ineligibility_reason as "encryptedIneligibilityReason",
    ineligibility_expiry_time as "ineligibilityExpiryTime"

  FROM reports
  WHERE report_id = $1
  `;
  const res = await dbQuery<EncryptedBarkReport>(dbContext, sql, [reportId]);
  if (res.rows.length === 0) {
    return null;
  }
  return res.rows[0];
}
