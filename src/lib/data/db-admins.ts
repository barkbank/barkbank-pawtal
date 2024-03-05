import { DbContext, dbQuery, toCamelCaseRow } from "./db-utils";
import { Admin, AdminGen, AdminSpec } from "./db-models";

export async function dbInsertAdmin(
  ctx: DbContext,
  adminSpec: AdminSpec,
): Promise<AdminGen> {
  const sql = `
    INSERT INTO admins (
      admin_hashed_email,
      admin_encrypted_pii,
      admin_can_manage_admin_accounts,
      admin_can_manage_vet_accounts,
      admin_can_manage_user_accounts,
      admin_can_manage_donors
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING admin_id, admin_creation_time, admin_modification_time
  `;
  const res = await dbQuery(ctx, sql, [
    adminSpec.adminHashedEmail,
    adminSpec.adminEncryptedPii,
    adminSpec.adminCanManageAdminAccounts,
    adminSpec.adminCanManageVetAccounts,
    adminSpec.adminCanManageUserAccounts,
    adminSpec.adminCanManageDonors,
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
      admin_can_manage_admin_accounts,
      admin_can_manage_vet_accounts,
      admin_can_manage_user_accounts,
      admin_can_manage_donors,
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

export async function dbGrantCanManageAdminAccounts(
  ctx: DbContext,
  adminId: string,
): Promise<boolean> {
  const sql = `
    UPDATE admins
    SET admin_can_manage_admin_accounts = TRUE
    WHERE admin_id = $1
    AND admin_can_manage_admin_accounts = FALSE
    RETURNING 1
  `;
  const res = await dbQuery(ctx, sql, [adminId]);
  return res.rows.length === 1;
}
