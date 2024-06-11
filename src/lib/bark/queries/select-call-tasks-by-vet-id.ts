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
  SELECT
  FROM dog_vet_preferences as tPref
  LEFT JOIN dog_statuses as tStatus on tPref.dog_id = tStatus.dog_id
  LEFT JOIN calls as tCall as tPref.dog_id = tCall.dog_id
  WHERE tPref.vet_id = $1
  AND tStatus.service_status = 'AVAILABLE'
  AND tStatus.profile_status = 'COMPLETE'
  AND tStatus.medical_status = 'ELIGIBLE'
  AND tStatus.participation_status = 'PARTICIPATING'
  `;
  const res = await dbQuery<EncryptedCallTask>(dbContext, sql, [vetId]);
  return res.rows.map((row) => EncryptedCallTaskSchema.parse(row));
}
