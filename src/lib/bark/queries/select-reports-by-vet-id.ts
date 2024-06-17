import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  EncryptedBarkReport,
  EncryptedBarkReportSchema,
} from "../models/encrypted-bark-report";
import { CTE_ENCRYPTED_BARK_REPORT } from "./cte-encrypted-bark-report";

export async function selectReportsByVetId(
  dbContext: DbContext,
  args: { vetId: string },
): Promise<EncryptedBarkReport[]> {
  const { vetId } = args;
  const sql = `
  SELECT *
  FROM (${CTE_ENCRYPTED_BARK_REPORT}) as tReport
  WHERE tReport."vetId" = $1
  ORDER BY tReport."visitTime" DESC
  `;
  const res = await dbQuery<EncryptedBarkReport>(dbContext, sql, [vetId]);
  return res.rows.map((row) => EncryptedBarkReportSchema.parse(row));
}
