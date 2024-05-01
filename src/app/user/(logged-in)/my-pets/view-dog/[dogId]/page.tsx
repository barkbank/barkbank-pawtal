import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { getDogAppointments } from "@/lib/user/actions/get-dog-appointments";
import { getDogProfile } from "@/lib/user/actions/get-dog-profile";
import { getDogStatuses } from "@/lib/user/actions/get-dog-statuses";
import { redirect } from "next/navigation";

export default async function Page(props: { params: { dogId: string } }) {
  const { dogId } = props.params;
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const [resDogProfile, resDogStatuses, resDogAppointments] = await Promise.all(
    [
      getDogProfile(actor, dogId),
      getDogStatuses(actor, dogId),
      getDogAppointments(actor, dogId),
    ],
  );

  return (
    <div className="m-3">
      <p>View Dog {dogId}</p>

      <p>
        <pre className="text-xs">{JSON.stringify(resDogProfile, null, 2)}</pre>
      </p>
      <p>
        <pre className="text-xs">{JSON.stringify(resDogStatuses, null, 2)}</pre>
      </p>
      <p>
        <pre className="text-xs">
          {JSON.stringify(resDogAppointments, null, 2)}
        </pre>
      </p>
    </div>
  );
}
