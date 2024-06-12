import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  EncryptedCallTask,
  EncryptedCallTaskSchema,
} from "../models/encrypted-call-task";

/**
 * Call tasks are dogs that can be scheduled.
 *
 * - the actor is a preferred vet of the dog
 * - AND dog has no pending reports
 * - AND service_status is AVAILABLE
 * - AND profile_status is COMPLETE
 * - AND medical_status is ELIGIBLE
 * - AND participation_status is PARTICPATING
 *
 * @returns list of encrypted call tasks
 */
export async function selectCallTasksByVetId(
  dbContext: DbContext,
  args: { vetId: string },
): Promise<EncryptedCallTask[]> {
  const { vetId } = args;
  const sql = `
  WITH
  mVetDogs as (
    SELECT dog_id
    FROM dog_vet_preferences
    WHERE vet_id = $1
  ),
  mDogsEligible as (
    SELECT dog_id
    FROM dog_statuses
    WHERE service_status = 'AVAILABLE'
    AND profile_status = 'COMPLETE'
    AND medical_status = 'ELIGIBLE'
    AND participation_status = 'PARTICIPATING'
  ),
  mDogsWithAppointments as (
    SELECT dog_id
    FROM calls
    WHERE call_outcome = 'APPOINTMENT'
  ),
  mResults as (
    SELECT
      tDog.dog_id,
      tDog.dog_encrypted_oii,
      tDog.dog_breed,
      tDog.dog_birthday,
      tDog.dog_gender,
      tDog.dog_ever_received_transfusion,
      tDog.dog_ever_pregnant,
      tLatest.latest_dog_weight_kg,
      tUser.user_encrypted_pii
    FROM dogs as tDog
    LEFT JOIN latest_values as tLatest on tDog.dog_id = tLatest.dog_id
    LEFT JOIN users as tUser on tDog.user_id = tUser.user_id
    WHERE tDog.dog_id IN (SELECT dog_id FROM mVetDogs)
    AND tDog.dog_id IN (SELECT dog_id FROM mDogsEligible)
    AND tDog.dog_id NOT IN (SELECT dog_id FROM mDogsWithAppointments)
  )

  SELECT
    dog_id as "dogId",
    dog_breed as "dogBreed",
    dog_birthday as "dogBirthday",
    dog_gender as "dogGender",
    latest_dog_weight_kg as "dogWeightKg",
    dog_ever_received_transfusion as "dogEverReceivedTransfusion",
    dog_ever_pregnant as "dogEverPregnant",
    dog_encrypted_oii as "dogEncryptedOii",
    user_encrypted_pii as "userEncryptedPii"
  FROM mResults
  `;
  const res = await dbQuery<EncryptedCallTask>(dbContext, sql, [vetId]);
  return res.rows.map((row) => EncryptedCallTaskSchema.parse(row));
}
