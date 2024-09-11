import { CODE } from "@/lib/utilities/bark-code";
import { BarkContext } from "../bark-context";
import { BarkReport } from "../models/report-models";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { selectReportsByDogId } from "../queries/select-reports-by-dog-id";
import { toBarkReport } from "../mappers/to-bark-report";
import { dbRelease } from "@/lib/data/db-utils";
import { selectOwnerByDogId } from "../queries/select-owner-by-dog-id";

export async function opFetchReportsByDogId(
  context: BarkContext,
  args: { dogId: string; actorUserId?: string },
): Promise<
  Result<
    { reports: BarkReport[] },
    | typeof CODE.FAILED
    | typeof CODE.ERROR_DOG_NOT_FOUND
    | typeof CODE.ERROR_WRONG_OWNER
  >
> {
  const { dbPool } = context;
  const { dogId, actorUserId } = args;
  const conn = await dbPool.connect();
  try {
    if (actorUserId !== undefined) {
      const ownerInfo = await selectOwnerByDogId(conn, { dogId });
      if (ownerInfo === null) {
        return Err(CODE.ERROR_DOG_NOT_FOUND);
      }
      if (ownerInfo.ownerUserId !== actorUserId) {
        return Err(CODE.ERROR_WRONG_OWNER);
      }
    }
    const encryptedReports = await selectReportsByDogId(conn, { dogId });
    const reports = await Promise.all(
      encryptedReports.map((encrypted) => toBarkReport(context, encrypted)),
    );
    return Ok({ reports });
  } catch (err) {
    console.log(err);
    return Err(CODE.FAILED);
  } finally {
    await dbRelease(conn);
  }
}
