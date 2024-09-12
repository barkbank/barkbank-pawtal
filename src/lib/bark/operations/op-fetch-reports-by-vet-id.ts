import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "../bark-context";
import { BarkReport } from "../models/report-models";
import { CODE } from "@/lib/utilities/bark-code";
import { toBarkReport } from "../mappers/to-bark-report";
import { selectReportsByVetId } from "../queries/select-reports-by-vet-id";

export async function opFetchReportsByVetId(
  context: BarkContext,
  args: { vetId: string },
): Promise<Result<{ reports: BarkReport[] }, typeof CODE.FAILED>> {
  const { dbPool } = context;
  const { vetId } = args;
  try {
    const encryptedReports = await selectReportsByVetId(dbPool, { vetId });
    const futureReports = encryptedReports.map(async (encryptedReport) =>
      toBarkReport(context, encryptedReport),
    );
    const reports = await Promise.all(futureReports);
    return Ok({ reports });
  } catch (err) {
    console.error(err);
    return Err(CODE.FAILED);
  }
}
