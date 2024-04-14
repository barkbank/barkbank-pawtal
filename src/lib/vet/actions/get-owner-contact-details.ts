import { Err, Ok, Result } from "@/lib/utilities/result";
import { VetActor } from "../vet-actor";
import { OwnerContactDetails } from "../vet-models";
import { dbQuery } from "@/lib/data/db-utils";

type ErrorCode = "ERROR_UNAUTHORIZED" | "ERROR_NO_DOG";

/**
 * Get contact details of a dog's owner.
 *
 * @param actor Vet Actor
 * @param dogId Dog ID
 * @returns ERROR_UNAUTHORIZED when vet is not a preferred vet.
 * @returns ERROR_NO_DOG when dogId matches no dog.
 * @returns owner contact details otherwise.
 */
export async function getOwnerContactDetails(
  actor: VetActor,
  dogId: string,
): Promise<Result<OwnerContactDetails, ErrorCode>> {
  const ctx: Context = { actor, dogId };
  const row: Row | null = await fetchRow(ctx);
  if (row === null) {
    return Err("ERROR_NO_DOG");
  }
  if (row.isPreferredVet === false) {
    return Err("ERROR_UNAUTHORIZED");
  }
  const res = await toOwnerContactDetails(ctx, row);
  return Ok(res);
}

type Context = {
  actor: VetActor;
  dogId: string;
};

type Row = {
  isPreferredVet: boolean;
  userEncryptedPii: string;
  vetUserLastContactedTime: Date | null;
};

async function fetchRow(ctx: Context): Promise<Row | null> {
  const { actor, dogId } = ctx;
  const { dbPool, vetId } = actor.getParams();
  const sql = `
  WITH
  mVetLatestCall as (
    -- This is the latest call to the user regardless of dog
    SELECT
      tDog.user_id,
      MAX(tCall.call_creation_time) as max_call_creation_time
    FROM calls as tCall
    LEFT JOIN dogs as tDog on tCall.dog_id = tDog.dog_id
    WHERE tCall.vet_id = $2
    AND tDog.user_id IN (
      SELECT user_id
      FROM dogs
      WHERE dog_id = $1
    )
    GROUP BY tDog.user_id
  )

  SELECT
    $2 IN (
      SELECT vet_id
      FROM dog_vet_preferences
      WHERE dog_id = $1
    ) as "isPreferredVet",
    tUser.user_encrypted_pii as "userEncryptedPii",
    tCall.max_call_creation_time as "vetUserLastContactedTime"
  FROM dogs as tDog
  LEFT JOIN users as tUser on tDog.user_id = tUser.user_id
  LEFT JOIN mVetLatestCall as tCall on tDog.user_id = tCall.user_id
  WHERE dog_id = $1
  `;
  const res = await dbQuery<Row>(dbPool, sql, [dogId, vetId]);
  return res.rows.length === 1 ? res.rows[0] : null;
}

async function toOwnerContactDetails(
  ctx: Context,
  row: Row,
): Promise<OwnerContactDetails> {
  const { actor, dogId } = ctx;
  const { userMapper } = actor.getParams();
  const { isPreferredVet, userEncryptedPii, ...otherFields } = row;
  const { userName, userEmail, userPhoneNumber } =
    await userMapper.mapUserEncryptedPiiToUserPii({ userEncryptedPii });
  return {
    dogId,
    userName,
    userEmail,
    userPhoneNumber,
    ...otherFields,
  };
}
