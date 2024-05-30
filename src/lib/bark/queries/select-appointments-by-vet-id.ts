import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  EncryptedBarkAppointment,
  EncryptedBarkAppointmentSchema,
} from "../bark-models";

export async function selectAppointmentsByVetId(
  dbContext: DbContext,
  args: { vetId: string },
): Promise<EncryptedBarkAppointment[]> {
  const { vetId } = args;
  const sql = `
  SELECT
    tCall.call_id as "appointmentId",
    tCall.dog_id as "dogId",
    tCall.vet_id as "vetId",
    tDog.dog_breed as "dogBreed",
    tDog.dog_gender as "dogGender",
    tDog.dog_encrypted_oii as "dogEncryptedOii",
    tUser.user_encrypted_pii as "userEncryptedPii"
  FROM calls as tCall
  LEFT JOIN dogs as tDog on tCall.dog_id = tDog.dog_id
  LEFT JOIN users as tUser on tDog.user_id = tUser.user_id
  WHERE tCall.call_outcome = 'APPOINTMENT'
  AND tCall.vet_id = $1
  `;
  const res = await dbQuery<EncryptedBarkAppointment>(dbContext, sql, [vetId]);
  return res.rows.map((row) => EncryptedBarkAppointmentSchema.parse(row));
}
