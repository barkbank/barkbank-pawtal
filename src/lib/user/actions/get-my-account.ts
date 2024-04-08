import { UserActor } from "../user-actor";
import { dbQuery } from "@/lib/data/db-utils";
import { MyAccount } from "../user-models";

export async function getMyAccount(
  actor: UserActor,
): Promise<MyAccount | null> {
  const { userId, dbPool, userMapper } = actor.getParams();

  const sql = `
  SELECT
    user_creation_time as "userCreationTime",
    user_hashed_email as "userHashedEmail",
    user_encrypted_pii as "userEncryptedPii",
    user_residency as "userResidency"
  FROM 
    users
  WHERE 
    user_id = $1
  `;
  const res = await dbQuery(dbPool, sql, [userId]);
  if (res.rows.length === 0) {
    return null;
  }
  const { userHashedEmail, userEncryptedPii, ...otherFields } = res.rows[0];

  const { userName, userEmail, userPhoneNumber } =
    await userMapper.mapUserSecurePiiToUserPii({
      userHashedEmail,
      userEncryptedPii,
    });

  return {
    userName,
    userEmail,
    userPhoneNumber,
    ...otherFields,
  };
}
