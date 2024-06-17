import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { getDogPreferredVet } from "@/lib/user/actions/get-dog-preferred-vet";
import { getDogProfile } from "@/lib/user/actions/get-dog-profile";
import { getDogStatuses } from "@/lib/user/actions/get-dog-statuses";
import { UserActor } from "@/lib/user/user-actor";
import { CODE } from "@/lib/utilities/bark-code";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { redirect } from "next/navigation";
import { DogViewer } from "../../_lib/components/dog-viewer/dog-viewer";
import APP from "@/lib/app";
import { opFetchDogAppointmentsByDogId } from "@/lib/bark/operations/op-fetch-dog-appointments-by-dog-id";
import { DogViewerData } from "../../_lib/components/dog-viewer/dog-viewer-data";

export default async function Page(props: { params: { dogId: string } }) {
  const { dogId } = props.params;
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const { result, error } = await getDogViewerData(actor, dogId);
  if (error !== undefined) {
    redirect(RoutePath.USER_MY_PETS);
  }
  const { dogProfile, dogStatuses, dogAppointments, dogPreferredVet } = result;

  return (
    <DogViewer
      dogId={dogId}
      dogProfile={dogProfile}
      dogStatuses={dogStatuses}
      dogAppointments={dogAppointments}
      dogPreferredVet={dogPreferredVet}
    />
  );
}

async function getDogViewerData(
  actor: UserActor,
  dogId: string,
): Promise<
  Result<
    DogViewerData,
    | typeof CODE.ERROR_DOG_NOT_FOUND
    | typeof CODE.ERROR_WRONG_OWNER
    | typeof CODE.DB_QUERY_FAILURE
    | typeof CODE.ERROR_MORE_THAN_ONE_PREFERRED_VET
    | typeof CODE.FAILED
  >
> {
  const actorUserId = actor.getUserId();
  const context = await APP.getBarkContext();
  const [
    resDogProfile,
    resDogStatuses,
    resDogAppointments,
    resDogPreferredVet,
  ] = await Promise.all([
    getDogProfile(actor, dogId),
    getDogStatuses(actor, dogId),
    opFetchDogAppointmentsByDogId(context, {
      dogId,
      actorUserId,
    }),
    getDogPreferredVet(actor, dogId),
  ]);

  if (resDogProfile.error !== undefined) {
    return Err(resDogProfile.error);
  }
  if (resDogStatuses.error !== undefined) {
    return Err(resDogStatuses.error);
  }
  if (resDogAppointments.error !== undefined) {
    return Err(resDogAppointments.error);
  }
  if (resDogPreferredVet.error !== undefined) {
    return Err(resDogPreferredVet.error);
  }
  return Ok({
    dogId,
    dogProfile: resDogProfile.result,
    dogStatuses: resDogStatuses.result,
    dogAppointments: resDogAppointments.result.appointments,
    dogPreferredVet: resDogPreferredVet.result,
  });
}
