import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { VetClinic, VetClinicSchema } from "../models/vet-models";

export async function selectVetClinicByEmail(
  db: DbContext,
  args: { email: string },
): Promise<VetClinic | null> {
  const { email } = args;
  const sql = `
  SELECT
    vet_id as "vetId",
    vet_email as "vetEmail",
    vet_name as "vetName",
    vet_phone_number as "vetPhoneNumber",
    vet_address as "vetAddress"
  FROM vets
  WHERE vet_email = $1
  `;
  const res = await dbQuery<VetClinic>(db, sql, [email]);
  if (res.rows.length !== 1) {
    return null;
  }
  return VetClinicSchema.parse(res.rows[0]);
}
