import { DbContext, dbQuery, toCamelCaseRow } from "./db-utils";
import { Admin, AdminGen, AdminSpec } from "./db-models";

export async function dbInsertAdmin(
  ctx: DbContext,
  adminSpec: AdminSpec,
): Promise<AdminGen> {
  const sql = `
    INSERT INTO admins (
      admin_hashed_email,
      admin_encrypted_pii
    )
    VALUES ($1, $2)
    RETURNING admin_id, admin_creation_time, admin_modification_time
  `;
  const res = await dbQuery(ctx, sql, [
    adminSpec.adminHashedEmail,
    adminSpec.adminEncryptedPii,
  ]);
  return toCamelCaseRow(res.rows[0]);
}

export async function dbSelectAdmin(
  ctx: DbContext,
  adminId: string,
): Promise<Admin | null> {
  const sql = `
    SELECT
      admin_hashed_email,
      admin_encrypted_pii,
      admin_id,
      admin_creation_time,
      admin_modification_time
    FROM admins
    WHERE admin_id = $1
  `;
  const res = await dbQuery(ctx, sql, [adminId]);
  if (res.rows.length === 1) {
    return toCamelCaseRow(res.rows[0]);
  }
  return null;
}

export async function dbSelectAdminIdByAdminHashedEmail(
  ctx: DbContext,
  adminHashedEmail: string,
): Promise<string | null> {
  const sql = `
    SELECT admin_id
    FROM admins
    WHERE admin_hashed_email = $1
  `;
  const res = await dbQuery(ctx, sql, [adminHashedEmail]);
  if (res.rows.length === 1) {
    return res.rows[0].admin_id;
  }
  return null;
}
