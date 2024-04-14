import { UserActor } from "../user-actor";
import { dbQuery } from "@/lib/data/db-utils";
import { MyLastContactedTime } from "../user-models";

export async function getMyLatestCall(
  actor: UserActor,
): Promise<MyLastContactedTime | null> {
  const { userId, dbPool } = actor.getParams();

  const sql = `
  SELECT
    MAX(tCall.call_creation_time) as "userLastContactedTime"
  FROM
    users as tUser
  LEFT JOIN dogs as tDog on tUser.user_id = tDog.user_id
  LEFT JOIN calls as tCall on tDog.dog_id = tCall.dog_id
  WHERE
    tUser.user_id = $1
  GROUP BY tUser.user_id
  `;

  const res = await dbQuery<MyLastContactedTime>(dbPool, sql, [userId]);
  if (res.rows.length === 0) {
    return null;
  }
  return res.rows[0];
}
