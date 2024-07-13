import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { EncryptedAdminFields } from "../models/encrypted-admin-fields";

export async function updateEncryptedAdminFields(
  dbContext: DbContext,
  args: {
    encryptedAdminFields: EncryptedAdminFields;
  },
): Promise<void> {
  const { adminId, adminEncryptedPii } = args.encryptedAdminFields;
  const sql = `
  UPDATE admins
  SET admin_encrypted_pii = $2
  WHERE admin_id = $1
  RETURNING 1
  `;
  const res = await dbQuery(dbContext, sql, [adminId, adminEncryptedPii]);
  if (res.rows.length !== 1) {
    throw new Error(`Failed to update admin record (adminId=${adminId})`);
  }
}
