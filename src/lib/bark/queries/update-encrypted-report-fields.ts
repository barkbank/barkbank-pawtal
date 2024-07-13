import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { EncryptedReportFields } from "../models/encrypted-report-fields";

export async function updateEncryptedReportFields(
  dbContext: DbContext,
  args: {
    encryptedReportFields: EncryptedReportFields;
  },
): Promise<void> {
  const { reportId, encryptedIneligibilityReason } = args.encryptedReportFields;
  const sql = `
  UPDATE reports
  SET encrypted_ineligibility_reason = $2
  WHERE report_id = $1
  RETURNING 1
  `;
  const res = await dbQuery(dbContext, sql, [
    reportId,
    encryptedIneligibilityReason,
  ]);
  if (res.rows.length !== 1) {
    throw new Error(
      `Failed to update encrypted report fields (reportId=${reportId})`,
    );
  }
}
