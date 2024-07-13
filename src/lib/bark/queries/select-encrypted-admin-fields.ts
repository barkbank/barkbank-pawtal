import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  EncryptedAdminFields,
  EncryptedAdminFieldsSchema,
} from "../models/encrypted-admin-fields";
import { z } from "zod";

export async function selectEncryptedAdminFields(
  dbContext: DbContext,
): Promise<EncryptedAdminFields[]> {
  const sql = `
  SELECT
    admin_id as "adminId",
    admin_encrypted_pii as "adminEncryptedPii"
  FROM admins
  `;
  const res = await dbQuery<EncryptedAdminFields>(dbContext, sql, []);
  return z.array(EncryptedAdminFieldsSchema).parse(res.rows);
}
