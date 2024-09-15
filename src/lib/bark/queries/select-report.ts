import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  EncryptedBarkReport,
  EncryptedBarkReportSchema,
} from "../models/encrypted-bark-report";
import { SQL_ENCRYPTED_BARK_REPORT } from "./sql-encrypted-bark-report";

// WIP: Move this into EncryptedReportDao
export async function selectReport(
  dbContext: DbContext,
  args: { reportId: string },
): Promise<EncryptedBarkReport | null> {
  const { reportId } = args;
  const sql = `
  SELECT *
  FROM (${SQL_ENCRYPTED_BARK_REPORT}) as tReport
  WHERE tReport."reportId" = $1
  `;
  const res = await dbQuery<EncryptedBarkReport>(dbContext, sql, [reportId]);
  if (res.rows.length === 0) {
    return null;
  }
  return EncryptedBarkReportSchema.parse(res.rows[0]);
}
