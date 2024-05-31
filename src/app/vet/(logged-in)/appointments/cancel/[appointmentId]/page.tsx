import { getAuthenticatedVetActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { redirect } from "next/navigation";

export default async function Page(props: {
  params: { appointmentId: string };
}) {
  const actor = await getAuthenticatedVetActor();
  if (actor === null) {
    redirect(RoutePath.VET_LOGIN_PAGE);
  }
  const { appointmentId } = props.params;
  return <div>Stub page for cancelling appointment {appointmentId}</div>;
}
