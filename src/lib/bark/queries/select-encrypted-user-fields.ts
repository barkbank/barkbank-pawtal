import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  EncryptedUserFields,
  EncryptedUserFieldsSchema,
} from "../models/encrypted-user-fields";
import { z } from "zod";

export async function selectEncryptedUserFields(
  dbContext: DbContext,
): Promise<EncryptedUserFields[]> {
  const sql = `
  SELECT
    user_id as "userId",
    user_encrypted_pii as "userEncryptedPii"
  FROM users
  `;
  const res = await dbQuery<EncryptedUserFields>(dbContext, sql, []);
  const schema = z.array(EncryptedUserFieldsSchema);
  return schema.parse(res.rows);
}
