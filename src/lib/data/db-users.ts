import { DbContext, dbQuery, toCamelCaseRow } from "./db-utils";
import { UserRecord, UserGen, UserSpec } from "./db-models";

export async function dbInsertUser(
  ctx: DbContext,
  userSpec: UserSpec,
): Promise<UserGen> {
  const sql = `
  INSERT INTO users (
    user_hashed_email,
    user_encrypted_pii
    -- WIP: Should insert user_resides_in_singapore in dbInsertUser
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

export async function dbTryInsertUser(
  ctx: DbContext,
  userSpec: UserSpec,
): Promise<UserGen | null> {
  const sql = `
  INSERT INTO users (
    user_hashed_email,
    user_encrypted_pii
    -- WIP: Should insert user_resides_in_singapore in dbTryInsertUser
  )
  VALUES ($1, $2)
  ON CONFLICT (user_hashed_email) DO NOTHING
  RETURNING
    user_id,
    user_creation_time,
    user_modification_time
  `;
  const res = await dbQuery(ctx, sql, [
    userSpec.userHashedEmail,
    userSpec.userEncryptedPii,
  ]);
  if (res.rows.length !== 1) {
    return null;
  }
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
    -- WIP: set user_resides_in_singapore in dbUpdateUser
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
): Promise<UserRecord | null> {
  const sql = `
  SELECT
    user_id,
    user_creation_time,
    user_modification_time,
    user_hashed_email,
    user_encrypted_pii,
    TRUE as user_resides_in_singapore
    -- WIP: retrieve user_resides_in_singapore in dbSelectUser
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
