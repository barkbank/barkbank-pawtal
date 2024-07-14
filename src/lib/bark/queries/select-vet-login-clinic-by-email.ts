import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { VetLoginClinic, VetLoginClinicSchema } from "../models/vet-login";

export async function selectVetLoginClinicByEmail(
  db: DbContext,
  args: { email: string },
): Promise<VetLoginClinic | null> {
  const { email } = args;
  const sql = `
  SELECT
    vet_id as "vetId",
    vet_email as "vetEmail",
    vet_name as "vetName"
  FROM vets
  WHERE vet_email = $1
  `;
  const res = await dbQuery<VetLoginClinic>(db, sql, [email]);
  if (res.rows.length !== 1) {
    return null;
  }
  return VetLoginClinicSchema.parse(res.rows[0]);
}
