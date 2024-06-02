import { EncryptedBarkReport } from "../models/encrypted-bark-report";
import { BarkReport } from "../models/bark-report";
import { CODE } from "@/lib/utilities/bark-code";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "@/lib/bark/bark-context";
import { selectReport } from "../queries/select-report";
import { toBarkReport } from "../mappers/to-bark-report";

/**
 * Fetch report by ID
 */
export async function opFetchReport(
  context: BarkContext,
  args: { reportId: string },
): Promise<
  Result<
    { report: BarkReport },
    typeof CODE.ERROR_REPORT_NOT_FOUND | typeof CODE.FAILED
  >
> {
  const { dbPool } = context;
  const { reportId } = args;
  try {
    const encryptedReport = await selectReport(dbPool, {
      reportId,
    });
    if (encryptedReport === null) {
      return Err(CODE.ERROR_REPORT_NOT_FOUND);
    }
    const report = await toBarkReport(context, encryptedReport);
    return Ok({ report });
  } catch (err) {
    console.error(err);
    return Err(CODE.FAILED);
  }
}
