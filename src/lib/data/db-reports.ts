import { DbReportGen, DbReportSpec } from "./db-models";
import { DbContext, dbQuery } from "./db-utils";

export async function dbInsertReport(
  dbCtx: DbContext,
  reportSpec: DbReportSpec,
): Promise<DbReportGen> {
  const sql = `
  INSERT INTO reports (
    call_id,
    dog_id,
    vet_id,
    visit_time,
    dog_weight_kg,
    dog_body_conditioning_score,
    dog_did_donate_blood,
    dog_heartworm,
    dog_dea1_point1,
    dog_reported_ineligibility,
    encrypted_ineligibility_reason,
    ineligibility_expiry_time
  )
  VALUES (
    $1,
    (SELECT dog_id FROM calls WHERE call_id = $1),
    (SELECT vet_id FROM calls WHERE call_id = $1),
    $2, $3, $4, $5, $6, $7, $8, $9, $10
  )
  RETURNING
    report_id as "reportId",
    dog_id as "dogId",
    vet_id as "vetId",
    report_creation_time as "reportCreationTime",
    report_modification_time as "reportModificationTime"
  `;
  const res = await dbQuery(dbCtx, sql, [
    reportSpec.callId,
    reportSpec.visitTime,
    reportSpec.dogWeightKg,
    reportSpec.dogBodyConditioningScore,
    reportSpec.dogDidDonateBlood,
    reportSpec.dogHeartworm,
    reportSpec.dogDea1Point1,
    reportSpec.dogReportedIneligibility,
    reportSpec.encryptedIneligibilityReason,
    reportSpec.ineligibilityExpiryTime,
  ]);
  return res.rows[0] as DbReportGen;
}
