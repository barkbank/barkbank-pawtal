import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  EncryptedBarkAppointment,
  EncryptedBarkAppointmentSchema,
} from "../models/encrypted-bark-appointment";

export async function selectAppointment(
  dbContext: DbContext,
  args: { appointmentId: string },
): Promise<EncryptedBarkAppointment | null> {
  const { appointmentId } = args;
  const sql = `
  SELECT
    tCall.call_id as "appointmentId",
    CASE
      WHEN tCall.call_outcome = 'APPOINTMENT' THEN 'PENDING'
      ELSE tCall.call_outcome::text
    END as "appointmentStatus",
    tCall.dog_id as "dogId",
    tCall.vet_id as "vetId",
    tDog.dog_breed as "dogBreed",
    tDog.dog_gender as "dogGender",
    tDog.dog_encrypted_oii as "dogEncryptedOii",
    tUser.user_encrypted_pii as "userEncryptedPii"
  FROM calls as tCall
  LEFT JOIN dogs as tDog on tCall.dog_id = tDog.dog_id
  LEFT JOIN users as tUser on tDog.user_id = tUser.user_id
  WHERE tCall.call_outcome IN ('APPOINTMENT', 'REPORTED', 'CANCELLED')
  AND tCall.call_id = $1
  `;
  const res = await dbQuery<EncryptedBarkAppointment>(dbContext, sql, [
    appointmentId,
  ]);
  if (res.rows.length === 0) {
    return null;
  }
  return EncryptedBarkAppointmentSchema.parse(res.rows[0]);
}
