import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  EncryptedBarkReport,
  EncryptedBarkReportSchema,
} from "../models/encrypted-bark-report";
import { CTE_ENCRYPTED_BARK_REPORT } from "./cte-encrypted-bark-report";

export async function selectReportsByDogId(
  dbContext: DbContext,
  args: { dogId: string },
): Promise<EncryptedBarkReport[]> {
  const { dogId } = args;
  const sql = `
  SELECT *
  FROM (${CTE_ENCRYPTED_BARK_REPORT}) as tReport
  WHERE tReport."dogId" = $1
  ORDER BY tReport."visitTime" DESC
  `;
  const res = await dbQuery<EncryptedBarkReport>(dbContext, sql, [dogId]);
  return res.rows.map((row) => EncryptedBarkReportSchema.parse(row));
}
