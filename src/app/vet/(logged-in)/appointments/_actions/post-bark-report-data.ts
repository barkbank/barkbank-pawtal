"use server";

import APP from "@/lib/app";
import { getAuthenticatedVetActor } from "@/lib/auth";
import { BarkReportData } from "@/lib/bark/models/bark-report-data";
import { opSubmitReport } from "@/lib/bark/operations/op-submit-report";
import { RoutePath } from "@/lib/route-path";
import { CODE } from "@/lib/utilities/bark-code";
import { Err, Result } from "@/lib/utilities/result";
import { revalidatePath } from "next/cache";

export async function postBarkReportData(args: {
  appointmentId: string;
  reportData: BarkReportData;
}): Promise<
  Result<
    { reportId: string },
    | typeof CODE.ERROR_NOT_LOGGED_IN
    | typeof CODE.ERROR_APPOINTMENT_NOT_FOUND
    | typeof CODE.UNAUTHORIZED
    | typeof CODE.FAILED
  >
> {
  const actor = await getAuthenticatedVetActor();
  if (actor === null) {
    return Err(CODE.ERROR_NOT_LOGGED_IN);
  }
  const { vetId: actorVetId } = actor.getParams();
  const { appointmentId, reportData } = args;
  const context = await APP.getBarkContext();
  const res = await opSubmitReport(context, {
    appointmentId,
    reportData,
    actorVetId,
  });
  if (res.error === undefined) {
    revalidatePath(RoutePath.VET_APPOINTMENTS, "layout");
  }
  return res;
}
