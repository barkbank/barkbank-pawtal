import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  EncryptedBarkReport,
  EncryptedBarkReportSchema,
} from "../models/encrypted-bark-report";
import { SQL_ENCRYPTED_BARK_REPORT } from "./sql-encrypted-bark-report";

// WIP: Move this into EncryptedReportDao
export async function selectReportsByDogId(
  dbContext: DbContext,
  args: { dogId: string },
): Promise<EncryptedBarkReport[]> {
  const { dogId } = args;
  const sql = `
  SELECT *
  FROM (${SQL_ENCRYPTED_BARK_REPORT}) as tReport
  WHERE tReport."dogId" = $1
  ORDER BY tReport."visitTime" DESC
  `;
  const res = await dbQuery<EncryptedBarkReport>(dbContext, sql, [dogId]);
  return res.rows.map((row) => EncryptedBarkReportSchema.parse(row));
}
