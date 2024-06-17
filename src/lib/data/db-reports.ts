import { CallOutcome } from "../bark/enums/call-outcome";
import { DbReportGen, DbReportSpec } from "./db-models";
import { DbContext, dbQuery } from "./db-utils";

export async function dbInsertReportAndUpdateCall(
  dbCtx: DbContext,
  reportSpec: DbReportSpec,
): Promise<DbReportGen> {
  const sql = `
  WITH
  mCallDetails as (
    SELECT call_id, dog_id, vet_id
    FROM calls
    WHERE call_id = $1
    AND call_outcome = 'APPOINTMENT'
  ),
  mInsertReport as (
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
      -- These will resolve to NULL when call
      -- is in the wrong state and cause the
      -- transaction to rollback.
      (SELECT call_id FROM mCallDetails),
      (SELECT dog_id FROM mCallDetails),
      (SELECT vet_id FROM mCallDetails),

      $2, $3, $4, $5, $6, $7, $8, $9, $10
    )
    RETURNING
      report_id,
      dog_id,
      vet_id,
      report_creation_time,
      report_modification_time
  ),
  mUpdateCall as (
    UPDATE calls
    SET
      call_outcome = 'REPORTED'
    WHERE call_id = $1
    AND call_outcome = 'APPOINTMENT'
    RETURNING call_id, call_outcome
  )
  SELECT
    report_id as "reportId",
    dog_id as "dogId",
    vet_id as "vetId",
    report_creation_time as "reportCreationTime",
    report_modification_time as "reportModificationTime",
    call_id as "callId",
    call_outcome as "callOutcome"
  FROM mInsertReport, mUpdateCall
  `;
  type Row = DbReportGen & {
    callId: string;
    callOutcome: CallOutcome;
  };
  const res = await dbQuery<Row>(dbCtx, sql, [
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
  const { callId, callOutcome, ...otherFields } = res.rows[0];
  const reportGen: DbReportGen = otherFields;
  return reportGen;
}
