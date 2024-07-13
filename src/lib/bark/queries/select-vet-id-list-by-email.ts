import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { z } from "zod";

const RowSchema = z.object({
  vetId: z.string(),
});

type Row = z.infer<typeof RowSchema>;

export async function selectVetIdListByEmail(
  dbContext: DbContext,
  args: { email: string },
): Promise<{ vetId: string }[]> {
  const { email } = args;
  const sql = `
  SELECT vet_id as "vetId" FROM vets WHERE vet_email = $1
  UNION ALL
  SELECT vet_id as "vetId" FROM vet_accounts WHERE vet_account_email = $1
  `;
  const res = await dbQuery<Row>(dbContext, sql, [email]);
  return z.array(RowSchema).parse(res.rows);
}
