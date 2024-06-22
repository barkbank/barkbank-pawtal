import { BarkReport } from "../models/bark-report";
import { CODE } from "@/lib/utilities/bark-code";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { BarkContext } from "@/lib/bark/bark-context";
import { selectReport } from "../queries/select-report";
import { toBarkReport } from "../mappers/to-bark-report";
import { selectOwnerByDogId } from "../queries/select-owner-by-dog-id";
import { dbRelease } from "@/lib/data/db-utils";

/**
 * Fetch report by ID
 */
export async function opFetchReport(
  context: BarkContext,
  args: { reportId: string; actorVetId?: string; actorUserId?: string },
): Promise<
  Result<
    { report: BarkReport },
    | typeof CODE.ERROR_REPORT_NOT_FOUND
    | typeof CODE.ERROR_WRONG_OWNER
    | typeof CODE.ERROR_NOT_ALLOWED
    | typeof CODE.FAILED
  >
> {
  const { dbPool } = context;
  const { reportId, actorVetId, actorUserId } = args;
  const conn = await dbPool.connect();
  try {
    const encryptedReport = await selectReport(conn, {
      reportId,
    });
    if (encryptedReport === null) {
      return Err(CODE.ERROR_REPORT_NOT_FOUND);
    }
    const report = await toBarkReport(context, encryptedReport);
    if (actorVetId !== undefined && actorVetId !== report.vetId) {
      return Err(CODE.ERROR_NOT_ALLOWED);
    }
    if (actorUserId !== undefined) {
      const { dogId } = report;
      const resOwner = await selectOwnerByDogId(conn, { dogId });
      if (resOwner === null || resOwner.ownerUserId !== actorUserId) {
        return Err(CODE.ERROR_WRONG_OWNER);
      }
    }
    return Ok({ report });
  } catch (err) {
    console.error(err);
    return Err(CODE.FAILED);
  } finally {
    await dbRelease(conn);
  }
}
