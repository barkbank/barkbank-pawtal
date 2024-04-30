import { UserActor } from "../user-actor";
import { dbResultQuery } from "@/lib/data/db-utils";
import { MyAccount } from "../user-models";
import { UserResidency } from "@/lib/data/db-enums";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { BARK_CODE } from "@/lib/utilities/bark-code";

export async function getMyAccount(
  actor: UserActor,
): Promise<
  Result<
    MyAccount,
    typeof BARK_CODE.ERROR_USER_NOT_FOUND | typeof BARK_CODE.DB_QUERY_FAILURE
  >
> {
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
  type Row = {
    userCreationTime: Date;
    userHashedEmail: string;
    userEncryptedPii: string;
    userResidency: UserResidency;
  };
  const { result: res, error } = await dbResultQuery<Row>(dbPool, sql, [
    userId,
  ]);
  if (error !== undefined) {
    return Err(error);
  }
  if (res.rows.length !== 1) {
    return Err(BARK_CODE.ERROR_USER_NOT_FOUND);
  }
  const { userHashedEmail, userEncryptedPii, ...otherFields } = res.rows[0];

  const { userName, userEmail, userPhoneNumber } =
    await userMapper.mapUserSecurePiiToUserPii({
      userHashedEmail,
      userEncryptedPii,
    });

  return Ok({
    userName,
    userEmail,
    userPhoneNumber,
    ...otherFields,
  });
}
