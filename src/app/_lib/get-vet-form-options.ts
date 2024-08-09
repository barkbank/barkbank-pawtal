import {
  BarkFormOption,
  BarkFormOptionSchema,
} from "@/components/bark/bark-form-option";
import { dbQuery } from "@/lib/data/db-utils";
import { Pool } from "pg";
import { z } from "zod";

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
  const options = (res.rows.length === 0) ? [] : [
    {
      value: "",
      label: "None",
      description: "Do not contact me about this dog",
    },
    ...res.rows,
  ];
  return z.array(BarkFormOptionSchema).parse(options);
}
