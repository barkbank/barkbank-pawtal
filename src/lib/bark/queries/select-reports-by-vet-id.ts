import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  EncryptedBarkReport,
  EncryptedBarkReportSchema,
} from "../models/encrypted-bark-report";

export async function selectReportsByVetId(
  dbContext: DbContext,
  args: { vetId: string },
): Promise<EncryptedBarkReport[]> {
  const { vetId } = args;
  const sql = `
  SELECT
    tReport.report_id as "reportId",
    tReport.report_creation_time as "reportCreationTime",
    tReport.report_modification_time as "reportModificationTime",

    tReport.call_id as "appointmentId",
    tReport.dog_id as "dogId",
    tReport.vet_id as "vetId",

    tReport.visit_time as "visitTime",

    tReport.dog_weight_kg as "dogWeightKg",
    tReport.dog_body_conditioning_score as "dogBodyConditioningScore",
    tReport.dog_heartworm as "dogHeartworm",
    tReport.dog_dea1_point1 as "dogDea1Point1",

    tReport.dog_did_donate_blood as "dogDidDonateBlood",

    tReport.dog_reported_ineligibility as "ineligibilityStatus",
    tReport.encrypted_ineligibility_reason as "encryptedIneligibilityReason",
    tReport.ineligibility_expiry_time as "ineligibilityExpiryTime",

    tDog.dog_encrypted_oii as "dogEncryptedOii",
    tDog.dog_gender as "dogGender",
    tDog.dog_breed as "dogBreed",

    tUser.user_encrypted_pii as "userEncryptedPii"

  FROM reports as tReport
  LEFT JOIN dogs as tDog on tReport.dog_id = tDog.dog_id
  LEFT JOIN users as tUser on tDog.user_id = tUser.user_id
  WHERE vet_id = $1
  `;
  const res = await dbQuery<EncryptedBarkReport>(dbContext, sql, [vetId]);
  return res.rows.map((row) => EncryptedBarkReportSchema.parse(row));
}
