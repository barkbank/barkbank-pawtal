import { DbContext, dbQuery, toCamelCaseRow } from "./dbUtils";
import { User, UserGen, UserSpec } from "./models";

export async function dbInserUser(
  ctx: DbContext,
  userSpec: UserSpec,
): Promise<UserGen> {
  const sql = `
  INSERT INTO users (
    user_hashed_email,
    user_encrypted_pii,
    user_creation_time
  )
  VALUES ($1, $2, CURRENT_TIMESTAMP)
  RETURNING
    user_id,
    user_creation_time
  `;
  const res = await dbQuery(ctx, sql, [
    userSpec.userHashedEmail,
    userSpec.userEncryptedPii,
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
    user_hashed_email,
    user_encrypted_pii
  FROM users
  WHERE user_id = $1
  `;
  const res = await dbQuery(ctx, sql, [userId]);
  if (res.rows.length === 1) {
    return toCamelCaseRow(res.rows[0]);
  }
  return null;
}

export async function dbSelectUserByHashedEmail(
  ctx: DbContext,
  userHashedEmail: string,
): Promise<User | null> {
  const sql = `
  SELECT
    user_id,
    user_creation_time,
    user_hashed_email,
    user_encrypted_pii
  FROM users
  WHERE user_hashed_email = $1
  `;
  const res = await dbQuery(ctx, sql, [userHashedEmail]);
  if (res.rows.length === 1) {
    return toCamelCaseRow(res.rows[0]);
  }
  return null;
}
