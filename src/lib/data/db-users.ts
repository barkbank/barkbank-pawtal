import { DbContext, dbQuery } from "./db-utils";
import { UserRecord, UserGen, UserSpec } from "./db-models";

// TODO: Update the tests that use these functions to either (i) use EncryptedUserAccountDao or (ii) own the functionality in some _helper.ts test-only file.

export async function dbInsertUser(
  ctx: DbContext,
  userSpec: UserSpec,
): Promise<UserGen> {
  const sql = `
  INSERT INTO users (
    user_hashed_email,
    user_encrypted_pii,
    user_residency
  )
  VALUES ($1, $2, $3)
  RETURNING
    user_id as "userId",
    user_creation_time as "userCreationTime",
    user_modification_time as "userModificationTime"
  `;
  const res = await dbQuery<UserGen>(ctx, sql, [
    userSpec.userHashedEmail,
    userSpec.userEncryptedPii,
    userSpec.userResidency,
  ]);
  return res.rows[0];
}

// TODO: dbSelectUser is only really useful for tests, and that's debatable. can we remove it?
export async function dbSelectUser(
  ctx: DbContext,
  userId: string,
): Promise<UserRecord | null> {
  const sql = `
  SELECT
    user_id as "userId",
    user_creation_time as "userCreationTime",
    user_modification_time as "userModificationTime",
    user_hashed_email as "userHashedEmail",
    user_encrypted_pii as "userEncryptedPii",
    user_residency as "userResidency"
  FROM users
  WHERE user_id = $1
  `;
  const res = await dbQuery<UserRecord>(ctx, sql, [userId]);
  if (res.rows.length === 1) {
    return res.rows[0];
  }
  return null;
}

// TODO: Can we remove this? Callers should be using UserAccountService.
export async function dbSelectUserIdByHashedEmail(
  ctx: DbContext,
  userHashedEmail: string,
): Promise<string | null> {
  const sql = `
  SELECT user_id as "userId"
  FROM users
  WHERE user_hashed_email = $1
  `;
  const res = await dbQuery<{ userId: string }>(ctx, sql, [userHashedEmail]);
  if (res.rows.length === 1) {
    return res.rows[0].userId;
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
