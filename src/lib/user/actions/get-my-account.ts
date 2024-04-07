import { UserActor } from "../user-actor";
import { dbQuery } from "@/lib/data/db-utils";
import { MyAccount } from "../user-models";

export async function getMyAccount(
  actor: UserActor,
): Promise<MyAccount | null> {
  const { userId: user_id, dbPool, userMapper } = actor.getParams();

  const sql = `
  SELECT
    user_id as "userId",
    user_creation_time as "userCreationTime",
    user_hashed_email as "userHashedEmail",
    user_encrypted_pii as "userEncryptedPii",
    user_residency as "userResidency"
  FROM 
    users
  WHERE 
    user_id = $1
  `;
  const res = await dbQuery(dbPool, sql, [user_id]);
  if (res.rows.length === 0) {
    return null;
  }
  const {
    userId,
    userCreationTime,
    userHashedEmail,
    userEncryptedPii,
    userResidency,
  } = res.rows[0];

  const { userName, userEmail, userPhoneNumber } =
    await userMapper.mapUserSecurePiiToUserPii({
      userHashedEmail,
      userEncryptedPii,
    });

  return {
    userId,
    userCreationTime,
    userResidency,
    userName,
    userEmail,
    userPhoneNumber,
  };
}
