import { DbConnection, DbContext, dbQuery } from "@/lib/data/db-utils";
import { z } from "zod";
import {
  EncryptedBarkReport,
  EncryptedBarkReportSchema,
} from "../models/encrypted-bark-report";
import {
  BarkReportMetadata,
  BarkReportMetadataSchema,
} from "../models/bark-report-metadata";
import { EncryptedBarkReportData } from "../models/encrypted-bark-report-data";

/**
 * Data Access Object
 *
 * Input Types:
 * - EncryptedBarkReportData
 *
 * Output Types:
 * - EncryptedBarkReport
 * - BarkReportMetadata
 */
export class ReportDao {
  private barkReportQuery = `
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

    tVet.vet_name as "vetName",
    tVet.vet_phone_number as "vetPhoneNumber",
    tVet.vet_address as "vetAddress",

    tUser.user_encrypted_pii as "userEncryptedPii"

  FROM reports as tReport
  LEFT JOIN dogs as tDog on tReport.dog_id = tDog.dog_id
  LEFT JOIN users as tUser on tDog.user_id = tUser.user_id
  LEFT JOIN vets as tVet on tReport.vet_id = tVet.vet_id
  `;

  // TODO: Allow conn to be given to all dao methods and restrict constructor db to DbPool.
  constructor(private db: DbContext) {}

  async insert(args: {
    callId: string;
    spec: EncryptedBarkReportData;
    conn?: DbConnection;
  }): Promise<{ reportId: string }> {
    const RowSchema = z.object({ reportId: z.string() });
    type Row = z.infer<typeof RowSchema>;
    const { callId, spec, conn } = args;
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
    const res = await dbQuery<Row>(conn ?? this.db, sql, [
      callId,
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

  async getMetadata(args: {
    reportId: string;
  }): Promise<BarkReportMetadata | null> {
    const { reportId } = args;
    const sql = `
    SELECT
      report_id as "reportId",
      report_creation_time as "reportCreationTime",
      report_modification_time as "reportModificationTime",
      call_id as "appointmentId",
      dog_id as "dogId",
      vet_id as "vetId"
    FROM reports
    WHERE report_id = $1
    `;
    const res = await dbQuery<BarkReportMetadata>(this.db, sql, [reportId]);
    if (res.rows.length === 0) {
      return null;
    }
    return BarkReportMetadataSchema.parse(res.rows[0]);
  }

  async getEncryptedBarkReport(args: {
    reportId: string;
  }): Promise<EncryptedBarkReport | null> {
    const { reportId } = args;
    const sql = `
    SELECT *
    FROM (${this.barkReportQuery}) as tReport
    WHERE tReport."reportId" = $1
    `;
    const res = await dbQuery<EncryptedBarkReport>(this.db, sql, [reportId]);
    if (res.rows.length === 0) {
      return null;
    }
    return EncryptedBarkReportSchema.parse(res.rows[0]);
  }

  async getEncryptedBarkReportsByDogId(args: {
    dogId: string;
  }): Promise<EncryptedBarkReport[]> {
    const { dogId } = args;
    const sql = `
    SELECT *
    FROM (${this.barkReportQuery}) as tReport
    WHERE tReport."dogId" = $1
    ORDER BY tReport."visitTime" DESC
    `;
    const res = await dbQuery<EncryptedBarkReport>(this.db, sql, [dogId]);
    return z.array(EncryptedBarkReportSchema).parse(res.rows);
  }

  async getEncryptedBarkReportsByVetId(args: {
    vetId: string;
  }): Promise<EncryptedBarkReport[]> {
    const { vetId } = args;
    const sql = `
    SELECT *
    FROM (${this.barkReportQuery}) as tReport
    WHERE tReport."vetId" = $1
    ORDER BY tReport."visitTime" DESC
    `;
    const res = await dbQuery<EncryptedBarkReport>(this.db, sql, [vetId]);
    return z.array(EncryptedBarkReportSchema).parse(res.rows);
  }
}
