import { UserActor } from "../user-actor";
import { dbResultQuery } from "@/lib/data/db-utils";
import { MyLastContactedTime } from "../user-models";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { BARK_CODE } from "@/lib/utilities/bark-code";

export async function getMyLatestCall(
  actor: UserActor,
): Promise<
  Result<
    MyLastContactedTime,
    typeof BARK_CODE.ERROR_USER_NOT_FOUND | typeof BARK_CODE.DB_QUERY_FAILURE
  >
> {
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

  const { result: res, error } = await dbResultQuery<MyLastContactedTime>(
    dbPool,
    sql,
    [userId],
  );
  if (error !== undefined) {
    return Err(error);
  }
  if (res.rows.length === 0) {
    return Err(BARK_CODE.ERROR_USER_NOT_FOUND);
  }
  return Ok(res.rows[0]);
}
