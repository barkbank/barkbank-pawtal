import { BarkReport, EncryptedBarkReport } from "@/lib/bark/bark-models";
import { CODE } from "@/lib/utilities/bark-code";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "@/lib/bark/bark-context";
import { selectReport } from "../queries/select-report";

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
  const { dbPool, textEncryptionService } = context;
  const { reportId } = args;
  try {
    const row: EncryptedBarkReport = await selectReport(dbPool, { reportId });
    const { encryptedIneligibilityReason, ...otherFields } = row;
    const ineligibilityReason = await textEncryptionService.getDecryptedData(
      encryptedIneligibilityReason,
    );
    const report = {
      ...otherFields,
      ineligibilityReason,
    };
    return Ok({ report });
  } catch (err) {
    console.error(err);
    return Err(CODE.FAILED);
  }
}
