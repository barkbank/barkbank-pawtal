import APP from "@/lib/app";
import { getAuthenticatedVetActor } from "@/lib/auth";
import { BarkReportData } from "@/lib/bark/models/bark-report-data";
import { opEditReport } from "@/lib/bark/operations/op-edit-report";
import { RoutePath } from "@/lib/route-path";
import { CODE } from "@/lib/utilities/bark-code";
import { revalidatePath } from "next/cache";

export async function postUpdatedReport(args: {
  reportId: string;
  reportData: BarkReportData;
}): Promise<
  | typeof CODE.ERROR_NOT_LOGGED_IN
  | typeof CODE.OK
  | typeof CODE.ERROR_REPORT_NOT_FOUND
  | typeof CODE.ERROR_NOT_ALLOWED
  | typeof CODE.FAILED
> {
  const actor = await getAuthenticatedVetActor();
  if (actor === null) {
    return CODE.ERROR_NOT_LOGGED_IN;
  }
  const { vetId: actorVetId } = actor.getParams();
  const { reportId, reportData } = args;
  const context = await APP.getBarkContext();
  const res = await opEditReport(context, {
    reportId,
    reportData,
    actorVetId,
  });
  if (res === CODE.OK) {
    revalidatePath(RoutePath.VET_REPORTS, "layout");
  }
  return res;
}
