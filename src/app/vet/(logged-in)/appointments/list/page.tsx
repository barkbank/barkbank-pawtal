import { AppointmentList } from "@/app/vet/_lib/components/appointment-list";
import APP from "@/lib/app";
import { getAuthenticatedVetActor } from "@/lib/auth";
import { opFetchPendingAppointmentsByVetId } from "@/lib/bark/operations/op-fetch-pending-appointments-by-vet-id";
import { RoutePath } from "@/lib/route-path";
import { CODE } from "@/lib/utilities/bark-code";
import { redirect } from "next/navigation";

export default async function Page() {
  const actor = await getAuthenticatedVetActor();
  if (actor === null) {
    redirect(RoutePath.VET_LOGIN_PAGE);
  }
  const context = await APP.getBarkContext();
  const { vetId } = actor.getParams();

  const { result, error } = await opFetchPendingAppointmentsByVetId(context, {
    vetId,
  });
  if (error === CODE.FAILED) {
    return <div>Failed to fetch appointments</div>;
  }
  const { appointments } = result;

  return <AppointmentList appointments={appointments} />;
}
