import { BarkFormOption } from "@/components/bark/bark-form";
import { dbQuery } from "@/lib/data/db-utils";
import { Pool } from "pg";

// TODO: Move this into lib/bark/operations
export async function getVetFormOptions(
  dbPool: Pool,
): Promise<BarkFormOption[]> {
  const sql = `
    SELECT
      vet_id as "value",
      vet_name as "label",
      vet_address as "description"
    FROM vets
    ORDER BY vet_name
  `;
  const res = await dbQuery<BarkFormOption>(dbPool, sql, []);
  return res.rows;
}
