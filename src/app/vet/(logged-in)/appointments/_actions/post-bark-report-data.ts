"use server";

import { getAuthenticatedVetActor } from "@/lib/auth";
import { BarkReportData } from "@/lib/bark/bark-models";
import { CODE } from "@/lib/utilities/bark-code";
import { Err } from "@/lib/utilities/result";

export async function postBarkReportData(args: {
  appointmentId: string;
  reportData: BarkReportData;
}) {
  const actor = await getAuthenticatedVetActor();
  if (actor === null) {
    return Err(CODE.ERROR_NOT_LOGGED_IN);
  }
  const { reportData } = args;
}
