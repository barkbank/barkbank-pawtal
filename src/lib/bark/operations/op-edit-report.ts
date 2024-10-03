import { BarkReportData } from "../models/bark-report-data";
import { CODE } from "@/lib/utilities/bark-code";
import { BarkContext } from "../bark-context";
import { toEncryptedBarkReportData } from "../mappers/to-encrypted-bark-report-data";
import { dbBegin, dbCommit, dbRelease, dbRollback } from "@/lib/data/db-utils";
import { ReportDao } from "../daos/report-dao";

export async function opEditReport(
  context: BarkContext,
  args: { reportId: string; reportData: BarkReportData; actorVetId: string },
): Promise<
  | typeof CODE.OK
  | typeof CODE.ERROR_REPORT_NOT_FOUND
  | typeof CODE.ERROR_NOT_ALLOWED
  | typeof CODE.FAILED
> {
  const { dbPool } = context;
  const { reportId, reportData, actorVetId } = args;
  const reportDao = new ReportDao();
  const conn = await dbPool.connect();
  try {
    const encryptedReportData = await toEncryptedBarkReportData(
      context,
      reportData,
    );

    await dbBegin(conn);
    const metadata = await reportDao.getMetadata({ reportId, db: conn });
    if (metadata === null) {
      return CODE.ERROR_REPORT_NOT_FOUND;
    }
    if (metadata.vetId !== actorVetId) {
      return CODE.ERROR_NOT_ALLOWED;
    }
    const didUpdate = await reportDao.update({
      reportId,
      spec: encryptedReportData,
      db: conn,
    });
    if (!didUpdate) {
      return CODE.ERROR_REPORT_NOT_FOUND;
    }
    await dbCommit(conn);
    return CODE.OK;
  } catch (err) {
    console.error(err);
    await dbRollback(conn);
    return CODE.FAILED;
  } finally {
    await dbRelease(conn);
  }
}
