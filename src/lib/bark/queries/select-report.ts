import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  EncryptedBarkReport,
  EncryptedBarkReportSchema,
} from "../models/encrypted-bark-report";
import { CTE_ENCRYPTED_BARK_REPORT } from "./cte-encrypted-bark-report";

export async function selectReport(
  dbContext: DbContext,
  args: { reportId: string },
): Promise<EncryptedBarkReport | null> {
  const { reportId } = args;
  const sql = `
  SELECT *
  FROM (${CTE_ENCRYPTED_BARK_REPORT}) as tReport
  WHERE tReport."reportId" = $1
  `;
  const res = await dbQuery<EncryptedBarkReport>(dbContext, sql, [reportId]);
  if (res.rows.length === 0) {
    return null;
  }
  return EncryptedBarkReportSchema.parse(res.rows[0]);
}
