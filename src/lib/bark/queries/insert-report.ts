import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  EncryptedBarkReportData,
  EncryptedBarkReportDataSchema,
} from "../models/encrypted-bark-report-data";
import { z } from "zod";

const RowSchema = z.object({
  reportId: z.string(),
});

// WIP: Caller of this should call ReportDao. Note that this is a little different.
export async function insertReport(
  dbContext: DbContext,
  args: {
    appointmentId: string;
    encryptedReportData: EncryptedBarkReportData;
  },
): Promise<{ reportId: string }> {
  const { appointmentId, encryptedReportData } = args;
  const valdiatedData =
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
  } = valdiatedData;
  const sql = `
  WITH
  mAppointmentDetails as (
    SELECT call_id, dog_id, vet_id
    FROM calls
    WHERE call_id = $1
  ),
  mInsertion as (
    INSERT INTO reports (
      call_id,
      dog_id,
      vet_id,

      visit_time,

      dog_weight_kg,
      dog_body_conditioning_score,
      dog_heartworm,
      dog_dea1_point1,

      dog_reported_ineligibility,
      encrypted_ineligibility_reason,
      ineligibility_expiry_time,

      dog_did_donate_blood
    )
    VALUES (
      (SELECT call_id FROM mAppointmentDetails),
      (SELECT dog_id FROM mAppointmentDetails),
      (SELECT vet_id FROM mAppointmentDetails),
      $2, $3, $4, $5, $6, $7, $8, $9, $10
    )
    RETURNING report_id
  )

  SELECT report_id::text as "reportId" FROM mInsertion
  `;
  const res = await dbQuery<{ reportId: string }>(dbContext, sql, [
    appointmentId,
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
  return RowSchema.parse(res.rows[0]);
}
