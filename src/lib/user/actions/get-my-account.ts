import { UserActor } from "../user-actor";
import { dbQuery } from "@/lib/data/db-utils";
import { MyAccount } from "../user-models";
import { UserResidency } from "@/lib/data/db-enums";

export async function getMyAccount(actor: UserActor): Promise<MyAccount> {
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
  const res = await dbQuery<Row>(dbPool, sql, [userId]);
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
