import { UserActor } from "../user-actor";
import { dbQuery } from "@/lib/data/db-utils";
import { MyLastContactedTime } from "../user-models";

export async function getMyLatestCall(
  actor: UserActor,
): Promise<MyLastContactedTime | null> {
  const { userId: user_id, dbPool } = actor.getParams();

  const sql = `
  SELECT
    tUser.user_id as "userId",
    MAX(tCall.call_creation_time) as "userLastContactedTime"
  FROM
    users as tUser
  LEFT JOIN dogs as tDog on tUser.user_id = tDog.user_id
  LEFT JOIN calls as tCall on tDog.dog_id = tCall.dog_id
  WHERE
    tUser.user_id = $1
  GROUP BY tUser.user_id
  `;

  const res = await dbQuery(dbPool, sql, [user_id]);

  if (res.rows.length === 0) {
    return null;
  }

  const { userId, userLastContactedTime } = res.rows[0];

  return {
    userId,
    userLastContactedTime,
  };
}
