import { DbContext, dbQuery, toCamelCaseRow } from "./db-utils";
import { AdminRecord, AdminGen, AdminSpec } from "./db-models";

// WIP: Can remove?
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
): Promise<AdminRecord | null> {
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
