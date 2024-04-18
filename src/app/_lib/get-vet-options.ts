import { dbQuery, toCamelCaseRow } from "@/lib/data/db-utils";
import { Pool } from "pg";

export type VetOption = {
  vetId: string;
  vetName: string;
  vetAddress: string;
};

export async function getVetOptions(dbPool: Pool): Promise<VetOption[]> {
  const sql = `
    SELECT
      vet_id as "vetId",
      vet_name as "vetName",
      vet_address as "vetAddress"
    FROM vets
    ORDER BY vet_name
  `;
  const res = await dbQuery<VetOption>(dbPool, sql, []);
  return res.rows;
}
