import { DbContext, dbQuery, toCamelCaseRow } from "./dbUtils";
import { Admin, AdminGen, AdminSpec } from "./models";

export async function dbInsertStaff(
  ctx: DbContext,
  staffSpec: AdminSpec,
): Promise<AdminGen> {
  const sql = `
    INSERT INTO staff (
      staff_email,
      staff_name,
      staff_phone_number,
      staff_creation_time
    )
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
    RETURNING staff_id, staff_creation_time
  `;
  const res = await dbQuery(ctx, sql, [
    staffSpec.staffEmail,
    staffSpec.staffName,
    staffSpec.staffPhoneNumber,
  ]);
  return toCamelCaseRow(res.rows[0]);
}

export async function dbSelectStaff(
  ctx: DbContext,
  staffId: string,
): Promise<Admin | null> {
  const sql = `
    SELECT
      staff_email,
      staff_name,
      staff_phone_number,
      staff_id,
      staff_creation_time
    FROM staff
    WHERE staff_id = $1
  `;
  const res = await dbQuery(ctx, sql, [staffId]);
  if (res.rows.length === 1) {
    return toCamelCaseRow(res.rows[0]);
  }
  return null;
}
