import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  BarkAppointmentMetadata,
  BarkAppointmentMetadataSchema,
} from "../models/bark-appointment-metadata";

export async function selectAppointmentMetadata(
  dbContext: DbContext,
  args: { appointmentId: string },
): Promise<BarkAppointmentMetadata | null> {
  const { appointmentId } = args;
  const sql = `
  SELECT
    tCall.call_id as "appointmentId",
    CASE
      WHEN tCall.call_outcome = 'APPOINTMENT' THEN 'PENDING'
      ELSE tCall.call_outcome::text
    END as "appointmentStatus",
    tCall.dog_id as "dogId",
    tCall.vet_id as "vetId"
  FROM calls as tCall
  WHERE call_id = $1
  AND call_outcome IN ('APPOINTMENT', 'REPORTED', 'CANCELLED')
  `;
  const res = await dbQuery<BarkAppointmentMetadata>(dbContext, sql, [
    appointmentId,
  ]);
  if (res.rows.length === 0) {
    return null;
  }
  return BarkAppointmentMetadataSchema.parse(res.rows[0]);
}
