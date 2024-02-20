import { DbContext, dbQuery, toCamelCaseRow } from "./dbUtils";
import { User, UserGen, UserSpec } from "./models";

export async function dbInserUser(
  ctx: DbContext,
  userSpec: UserSpec,
): Promise<UserGen> {
  const sql = `
  INSERT INTO users (
    user_name,
    user_email,
    user_phone_number,
    user_creation_time
  )
  VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
  RETURNING
    user_id,
    user_creation_time
  `;
  const res = await dbQuery(ctx, sql, [
    userSpec.userName,
    userSpec.userEmail,
    userSpec.userPhoneNumber,
  ]);
  return toCamelCaseRow(res.rows[0]);
}

export async function dbSelectUser(
  ctx: DbContext,
  userId: string,
): Promise<User | null> {
  const sql = `
  SELECT
    user_id,
    user_creation_time,
    user_email,
    user_name,
    user_phone_number
  FROM users
  WHERE user_id = $1
  `;
  const res = await dbQuery(ctx, sql, [userId]);
  if (res.rows.length === 1) {
    return toCamelCaseRow(res.rows[0]);
  }
  return null;
}
