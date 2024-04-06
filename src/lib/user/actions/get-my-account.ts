import { MyAccount } from "@/lib/data/my-account-model";
import { UserActor } from "../user-actor";
import { dbQuery } from "@/lib/data/db-utils";
import { UserPii } from "@/lib/data/db-models";

export async function getMyAccount(
  actor: UserActor,
): Promise<MyAccount | null> {
  const { userId, dbPool } = actor.getParams();

  const sql = `
  SELECT
    user_id,
    user_creation_time,
    user_residency
  FROM users
  WHERE user_id = $1
  `;
  try {
    const res = await dbQuery(dbPool, sql, [userId]);
    const { user_id, user_creation_time, user_residency } = res.rows[0];
    const ownPii: UserPii | null = await actor.getOwnUserPii();
    if (!ownPii) {
      return null;
    }
    return {
      userId: user_id,
      userCreationTime: user_creation_time,
      userResidency: user_residency,
      ownPii,
    };
  } catch (e) {
    return null;
  }
}
