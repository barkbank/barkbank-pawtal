import { getAuthenticatedVetActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";
import { AppointmentScheduler } from "../../_lib/components/appointment-scheduler";
import APP from "@/lib/app";
import { opFetchCallTasksByVetId } from "@/lib/bark/operations/op-fetch-call-tasks-by-vet-id";
import { BarkError } from "@/components/bark/bark-error";

export default async function Page() {
  const actor = await getAuthenticatedVetActor();
  if (actor === null) {
    redirect(RoutePath.VET_LOGIN_PAGE);
  }
  const vetId = actor.getVetId();
  const context = await APP.getBarkContext();
  const { result, error } = await opFetchCallTasksByVetId(context, { vetId });
  if (error !== undefined) {
    return <BarkError className="m-3">Failed to fetch call tasks.</BarkError>;
  }
  const { callTasks } = result;
  return (
    <div>
      <AppointmentScheduler dogs={callTasks} />
    </div>
  );
}
