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
  userEncryptedPii: string;
  isPreferredVet: boolean;
};

async function fetchRow(ctx: Context): Promise<Row | null> {
  const { actor, dogId } = ctx;
  const { dbPool, vetId } = actor.getParams();
  const sql = `
  SELECT
    tUser.user_encrypted_pii as "userEncryptedPii",
    $2 IN (
      SELECT vet_id
      FROM dog_vet_preferences
      WHERE dog_id = $1
    ) as "isPreferredVet"
  FROM dogs as tDog
  LEFT JOIN users as tUser on tDog.user_id = tUser.user_id
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
  const { userEncryptedPii } = row;
  const { userName, userEmail, userPhoneNumber } =
    await userMapper.mapUserEncryptedPiiToUserPii({ userEncryptedPii });
  return {
    dogId,
    userName,
    userEmail,
    userPhoneNumber,
  };
}
