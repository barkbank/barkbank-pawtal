import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { VetClinic, VetClinicSchema } from "../models/vet-models";
import { z } from "zod";

export async function selectVetClinics(db: DbContext): Promise<VetClinic[]> {
  const sql = `
  SELECT
    vet_id as "vetId",
    vet_name as "vetName",
    vet_email as "vetEmail",
    vet_phone_number as "vetPhoneNumber",
    vet_address as "vetAddress"
  FROM vets
  ORDER BY vet_name ASC
  `;
  const res = await dbQuery<VetClinic>(db, sql, []);
  return z.array(VetClinicSchema).parse(res.rows);
}
