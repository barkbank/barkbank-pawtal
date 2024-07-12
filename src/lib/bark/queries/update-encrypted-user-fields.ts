import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { EncryptedUserFields } from "../models/encrypted-user-fields";

export async function updateEncryptedUserFields(
  dbContext: DbContext,
  args: { encryptedUserFields: EncryptedUserFields },
): Promise<{ updated: boolean }> {
  const { encryptedUserFields } = args;
  const { userId, userEncryptedPii } = encryptedUserFields;
  const sql = `
  UPDATE users
  SET user_encrypted_pii = $2
  WHERE user_id = $1
  RETURNING 1
  `;
  const res = await dbQuery(dbContext, sql, [userId, userEncryptedPii]);
  const updated = res.rows.length === 1;
  return { updated };
}
