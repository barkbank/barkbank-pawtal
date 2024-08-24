import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  EncryptedReportNotification,
  EncryptedReportNotificationSchema,
} from "../models/report-notification";

export async function selectReportNotification(
  db: DbContext,
  args: { reportId: string },
): Promise<EncryptedReportNotification | null> {
  const { reportId } = args;
  const sql = `
  SELECT
    tUser.user_id as "userId",
    tUser.user_encrypted_pii as "userEncryptedPii",
    tDog.dog_encrypted_oii as "dogEncryptedOii"
  FROM reports as tReport
  LEFT JOIN dogs as tDog on tReport.dog_id = tDog.dog_id
  LEFT JOIN users as tUser on tDog.user_id = tUser.user_id
  WHERE tReport.report_id = $1
  `;
  const res = await dbQuery<EncryptedReportNotification>(db, sql, [reportId]);
  if (res.rows.length !== 1) {
    return null;
  }
  return EncryptedReportNotificationSchema.parse(res.rows[0]);
}
