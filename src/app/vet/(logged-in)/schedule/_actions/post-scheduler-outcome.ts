"use server";

import { SchedulerOutcome } from "../_lib/scheduler-models";
import { CODE } from "@/lib/utilities/bark-code";
import { getAuthenticatedVetActor } from "@/lib/auth";
import { recordCallOutcome } from "@/lib/vet/actions/record-call-outcome";
import { revalidatePath } from "next/cache";
import { RoutePath } from "@/lib/route-path";

export async function postSchedulerOutcome(args: {
  dogId: string;
  callOutcome: SchedulerOutcome;
}): Promise<
  | typeof CODE.OK
  | typeof CODE.ERROR_NOT_LOGGED_IN
  | typeof CODE.ERROR_NOT_PREFERRED_VET
  | typeof CODE.DB_QUERY_FAILURE
> {
  const actor = await getAuthenticatedVetActor();
  if (actor === null) {
    return CODE.ERROR_NOT_LOGGED_IN;
  }
  const { error } = await recordCallOutcome(actor, args);
  if (error !== undefined) {
    return error;
  }
  revalidatePath(RoutePath.VET_SCHEDULE_APPOINTMENTS, "layout");
  return CODE.OK;
}
