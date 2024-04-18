import { dbQuery, toCamelCaseRow } from "@/lib/data/db-utils";
import { Pool } from "pg";

export type VetOption = {
  vetId: string;
  vetName: string;
  vetAddress: string;
};

export async function getVetOptions(dbPool: Pool): Promise<VetOption[]> {
  const sql = `
    SELECT vet_id, vet_name, vet_address
    FROM vets
    ORDER BY vet_name
  `;
  const res = await dbQuery(dbPool, sql, []);
  return res.rows.map(toCamelCaseRow) as VetOption[];
}
