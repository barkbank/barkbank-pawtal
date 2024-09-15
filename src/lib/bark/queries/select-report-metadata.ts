import { DbContext, dbQuery } from "@/lib/data/db-utils";
import {
  BarkReportMetadata,
  BarkReportMetadataSchema,
} from "../models/bark-report-metadata";

// WIP: Move into ReportMatadataDao
export async function selectReportMetadata(
  dbContext: DbContext,
  args: { reportId: string },
): Promise<BarkReportMetadata | null> {
  const { reportId } = args;
  const sql = `
  SELECT
    report_id as "reportId",
    report_creation_time as "reportCreationTime",
    report_modification_time as "reportModificationTime",
    call_id as "appointmentId",
    dog_id as "dogId",
    vet_id as "vetId"
  FROM reports
  WHERE report_id = $1
  `;
  const res = await dbQuery<BarkReportMetadata>(dbContext, sql, [reportId]);
  if (res.rows.length === 0) {
    return null;
  }
  return BarkReportMetadataSchema.parse(res.rows[0]);
}
