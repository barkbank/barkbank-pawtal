import { DbCall, Dog } from "@/lib/data/db-models";
import { UserActor } from "../user-actor";
import { dbQuery } from "@/lib/data/db-utils";

export async function getMyLatestCall(
  actor: UserActor,
): Promise<DbCall | null> {
  const { userId, dbPool, dogMapper } = actor.getParams();

  const sql = `
  WITH
  mUserDogs as (
      SELECT 
        dog_id
      FROM dogs
      WHERE user_id = $1
  ),
  mUserCalls as (
    SELECT 
      *
    FROM calls
    WHERE dog_id IN (SELECT dog_id FROM mUserDogs)
  )
  SELECT
    *
  FROM mUserCalls 
  ORDER BY call_creation_time DESC
  LIMIT 1
  `;

  const res = await dbQuery(dbPool, sql, [userId]);

  if (res.rows.length === 0) {
    return null;
  }

  const {
    call_id: callId,
    call_creation_time: callCreationTime,
    vet_id: vetId,
    dog_id: dogId,
    call_outcome: callOutcome,
    ecnrypted_opt_out_reason: encryptedOptOutReason,
  } = res.rows[0];

  return {
    callId,
    callCreationTime,
    vetId,
    dogId,
    callOutcome,
    encryptedOptOutReason,
  };
}
