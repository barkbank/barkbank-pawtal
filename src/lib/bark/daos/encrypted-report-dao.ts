import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { z } from "zod";
import { EncryptedReportSpec } from "../models/report-models";

export class EncryptedReportDao {
  constructor(private db: DbContext) {}

  async insert(args: {
    spec: EncryptedReportSpec;
  }): Promise<{ reportId: string }> {
    const RowSchema = z.object({ reportId: z.string() });
    type Row = z.infer<typeof RowSchema>;
    const { spec } = args;
    const sql = `
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
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING report_id as "reportId"
    `;
    const res = await dbQuery<Row>(this.db, sql, [
      spec.callId,
      spec.dogId,
      spec.vetId,
      spec.visitTime,
      spec.dogWeightKg,
      spec.dogBodyConditioningScore,
      spec.dogHeartworm,
      spec.dogDea1Point1,
      spec.ineligibilityStatus,
      spec.encryptedIneligibilityReason,
      spec.ineligibilityExpiryTime,
      spec.dogDidDonateBlood,
    ]);
    return RowSchema.parse(res.rows[0]);
  }

  async getReportCountByDog(args: {
    dogId: string;
  }): Promise<{ reportCount: number }> {
    const RowSchema = z.object({ reportCount: z.number() });
    type Row = z.infer<typeof RowSchema>;
    const { dogId } = args;
    const sql = `
    SELECT COUNT(1)::integer as "reportCount"
    FROM reports
    WHERE dog_id = $1
    `;
    const res = await dbQuery<Row>(this.db, sql, [dogId]);
    return RowSchema.parse(res.rows[0]);
  }
}
