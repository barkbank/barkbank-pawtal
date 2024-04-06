import { Err, Ok, Result } from "@/lib/utilities/result";
import { AdminActor } from "../admin-actor";
import { IncompleteProfile } from "../admin-models";
import { dbQuery } from "@/lib/data/db-utils";

type ErrorCode = "ERROR_UNAUTHORIZED";

export async function getIncompleteProfiles(
  actor: AdminActor,
  params: {
    limit: number;
    offset: number;
  },
): Promise<Result<IncompleteProfile[], ErrorCode>> {
  const { adminCanManageDonors } = await actor.getPermissions();
  if (!adminCanManageDonors) {
    return Err("ERROR_UNAUTHORIZED");
  }
  const { dbPool } = actor.getParams();
  const sql = `
  WITH
  mStatuses as (
    SELECT
      dog_id
    FROM dog_statuses as tStatus
    WHERE profile_status = 'INCOMPLETE'
  ),
  mProfiles as (
    SELECT
      tDog.user_id as "userId",
      tDog.dog_id as "dogId",
      tDog.dog_encrypted_oii as "dogEncryptedOii",
      tDog.dog_breed as "dogBreed",
      tDog.dog_weight_kg as "dogWeightKg",
      tDog.dog_ever_pregnant as "dogEverPregnant",
      tDog.dog_ever_received_transfusion as "dogEverReceivedTransfusion"
    FROM mStatuses as tStatus
    LEFT JOIN latest_values as tLatest on tStatus.dog_id = tLatest.dog_id
    LEFT JOIN dogs as tDog on tStatus.dog_id = tDog.dog_id
    ORDER BY tDog.dog_creation_time ASC
  )

  SELECT * FROM mProfiles
  `;
  const res = await dbQuery(dbPool, sql, []);
  return Ok(res.rows);
}
