import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  EncryptedReportFields,
  EncryptedReportFieldsSchema,
} from "../models/encrypted-report-fields";
import { z } from "zod";

export async function selectEncryptedReportFields(
  dbContext: DbContext,
): Promise<EncryptedReportFields[]> {
  const sql = `
  SELECT
    report_id as "reportId",
    encrypted_ineligibility_reason as "encryptedIneligibilityReason"
  FROM reports
  `;
  const res = await dbQuery<EncryptedReportFields>(dbContext, sql, []);
  return z.array(EncryptedReportFieldsSchema).parse(res.rows);
}
