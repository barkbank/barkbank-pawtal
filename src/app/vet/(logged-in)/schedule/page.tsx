import { getAuthenticatedVetActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { getAvailableDogs } from "@/lib/vet/actions/get-available-dogs";
import { redirect } from "next/navigation";
import { AppointmentScheduler } from "../../_lib/components/appointment-scheduler";

export default async function Page() {
  const actor = await getAuthenticatedVetActor();
  if (actor === null) {
    redirect(RoutePath.VET_LOGIN_PAGE);
  }
  const availableDogs = await getAvailableDogs(actor);
  return (
    <div>
      <AppointmentScheduler dogs={availableDogs} />
    </div>
  );
}
