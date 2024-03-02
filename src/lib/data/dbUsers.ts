import { DbContext, dbQuery, toCamelCaseRow } from "./dbUtils";
import { User, UserGen, UserSpec } from "./models";

export async function dbInsertUser(
  ctx: DbContext,
  userSpec: UserSpec,
): Promise<UserGen> {
  const sql = `
  INSERT INTO users (
    user_hashed_email,
    user_encrypted_pii
  )
  VALUES ($1, $2)
  RETURNING
    user_id,
    user_creation_time,
    user_modification_time
  `;
  const res = await dbQuery(ctx, sql, [
    userSpec.userHashedEmail,
    userSpec.userEncryptedPii,
  ]);
  return toCamelCaseRow(res.rows[0]);
}

export async function dbUpdateUser(
  ctx: DbContext,
  userId: string,
  userSpec: UserSpec,
): Promise<UserGen> {
  const sql = `
  UPDATE users SET
    user_hashed_email = $2,
    user_encrypted_pii = $3
  WHERE user_id = $1
  RETURNING
    user_id,
    user_creation_time,
    user_modification_time
  `;
  const res = await dbQuery(ctx, sql, [
    userId,
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
    user_modification_time,
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

export async function dbSelectUserIdByHashedEmail(
  ctx: DbContext,
  userHashedEmail: string,
): Promise<string | null> {
  const sql = `
  SELECT user_id
  FROM users
  WHERE user_hashed_email = $1
  `;
  const res = await dbQuery(ctx, sql, [userHashedEmail]);
  if (res.rows.length === 1) {
    return res.rows[0].user_id;
  }
  return null;
}

export async function dbDeleteUser(
  ctx: DbContext,
  userId: string,
): Promise<boolean> {
  const sql = `
  DELETE FROM users WHERE user_id = $1 RETURNING 1
  `;
  const res = await dbQuery(ctx, sql, [userId]);
  return res.rows.length === 1;
}
