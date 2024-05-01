import { getAuthenticatedUserActor } from "@/lib/auth";
import { DogAppointment, DogProfile, DogStatuses } from "@/lib/dog/dog-models";
import { RoutePath } from "@/lib/route-path";
import { getDogAppointments } from "@/lib/user/actions/get-dog-appointments";
import { getDogProfile } from "@/lib/user/actions/get-dog-profile";
import { getDogStatuses } from "@/lib/user/actions/get-dog-statuses";
import { UserActor } from "@/lib/user/user-actor";
import { CODE } from "@/lib/utilities/bark-code";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { redirect } from "next/navigation";

async function getPageData(
  actor: UserActor,
  dogId: string,
): Promise<
  Result<
    {
      dogProfile: DogProfile;
      dogStatuses: DogStatuses;
      dogAppointments: DogAppointment[];
    },
    | typeof CODE.ERROR_DOG_NOT_FOUND
    | typeof CODE.ERROR_WRONG_OWNER
    | typeof CODE.DB_QUERY_FAILURE
  >
> {
  const [resDogProfile, resDogStatuses, resDogAppointments] = await Promise.all(
    [
      getDogProfile(actor, dogId),
      getDogStatuses(actor, dogId),
      getDogAppointments(actor, dogId),
    ],
  );

  if (resDogProfile.error !== undefined) {
    return Err(resDogProfile.error);
  }
  if (resDogStatuses.error !== undefined) {
    return Err(resDogStatuses.error);
  }
  if (resDogAppointments.error !== undefined) {
    return Err(resDogAppointments.error);
  }
  return Ok({
    dogProfile: resDogProfile.result,
    dogStatuses: resDogStatuses.result,
    dogAppointments: resDogAppointments.result,
  });
}

export default async function Page(props: { params: { dogId: string } }) {
  const { dogId } = props.params;
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const { result, error } = await getPageData(actor, dogId);
  if (error !== undefined) {
    redirect(RoutePath.USER_MY_PETS);
  }
  const { dogProfile, dogStatuses, dogAppointments } = result;

  return (
    <div className="m-3">
      <p>View Dog {dogId}</p>
      <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
