"use server";

import APP from "@/lib/app";
import { getAuthenticatedVetActor } from "@/lib/auth";
import { opCancelAppointment } from "@/lib/bark/operations/op-cancel-appointment";
import { RoutePath } from "@/lib/route-path";
import { CODE } from "@/lib/utilities/bark-code";
import { revalidatePath } from "next/cache";

export async function postCancelAppointment(args: { appointmentId: string }) {
  const actor = await getAuthenticatedVetActor();
  if (actor === null) {
    return CODE.ERROR_NOT_LOGGED_IN;
  }
  const actorVetId = actor.getVetId();
  const { appointmentId } = args;
  const context = await APP.getBarkContext();
  const res = await opCancelAppointment(context, { appointmentId, actorVetId });
  if (res === CODE.OK) {
    revalidatePath(RoutePath.VET_APPOINTMENTS, "layout");
  }
  return res;
}
