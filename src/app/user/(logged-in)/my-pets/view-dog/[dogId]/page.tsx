import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { getDogPreferredVet } from "@/lib/user/actions/get-dog-preferred-vet";
import { getDogStatuses } from "@/lib/user/actions/get-dog-statuses";
import { UserActor } from "@/lib/user/user-actor";
import { CODE } from "@/lib/utilities/bark-code";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { redirect } from "next/navigation";
import { DogViewer } from "../../_lib/dog-viewer/dog-viewer";
import APP from "@/lib/app";
import { opFetchDogAppointmentsByDogId } from "@/lib/bark/operations/op-fetch-dog-appointments-by-dog-id";
import {
  DogViewerData,
  DogViewerDataSchema,
} from "../../_lib/dog-viewer/dog-viewer-data";
import { opFetchReportsByDogId } from "@/lib/bark/operations/op-fetch-reports-by-dog-id";

export default async function Page(props: { params: { dogId: string } }) {
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }

  const { dogId } = props.params;
  const { result, error } = await getDogViewerData(actor, dogId);
  if (error !== undefined) {
    redirect(RoutePath.USER_MY_PETS);
  }

  return <DogViewer data={result} />;
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
    resDogReports,
  ] = await Promise.all([
    actor.getDogProfile({ dogId }),
    getDogStatuses(actor, dogId),
    opFetchDogAppointmentsByDogId(context, {
      dogId,
      actorUserId,
    }),
    getDogPreferredVet(actor, dogId),
    opFetchReportsByDogId(context, { dogId, actorUserId }),
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
  if (resDogReports.error !== undefined) {
    return Err(resDogReports.error);
  }
  const data: DogViewerData = {
    dogId,
    dogProfile: resDogProfile.result,
    dogStatuses: resDogStatuses.result,
    dogAppointments: resDogAppointments.result.appointments,
    dogPreferredVet: resDogPreferredVet.result,
    dogReports: resDogReports.result.reports,
  };
  return Ok(DogViewerDataSchema.parse(data));
}
