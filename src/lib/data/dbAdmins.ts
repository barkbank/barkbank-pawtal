import { DbContext, dbQuery, toCamelCaseRow } from "./dbUtils";
import { Admin, AdminGen, AdminSpec } from "./models";

export async function dbInsertStaff(
  ctx: DbContext,
  staffSpec: AdminSpec,
): Promise<AdminGen> {
  const sql = `
    INSERT INTO admins (
      admin_email,
      admin_name,
      admin_phone_number,
      admin_creation_time
    )
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
    RETURNING admin_id, admin_creation_time
  `;
  const res = await dbQuery(ctx, sql, [
    staffSpec.adminEmail,
    staffSpec.adminName,
    staffSpec.adminPhoneNumber,
  ]);
  return toCamelCaseRow(res.rows[0]);
}

export async function dbSelectStaff(
  ctx: DbContext,
  staffId: string,
): Promise<Admin | null> {
  const sql = `
    SELECT
      admin_email,
      admin_name,
      admin_phone_number,
      admin_id,
      admin_creation_time
    FROM admins
    WHERE admin_id = $1
  `;
  const res = await dbQuery(ctx, sql, [staffId]);
  if (res.rows.length === 1) {
    return toCamelCaseRow(res.rows[0]);
  }
  return null;
}
