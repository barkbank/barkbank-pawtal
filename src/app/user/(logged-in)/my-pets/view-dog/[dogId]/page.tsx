import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { UserActor } from "@/lib/user/user-actor";
import { CODE } from "@/lib/utilities/bark-code";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { redirect } from "next/navigation";
import { DogViewer } from "../../_lib/dog-viewer/dog-viewer";
import {
  DogViewerData,
  DogViewerDataSchema,
} from "../../_lib/dog-viewer/dog-viewer-data";

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
  const [
    resDogProfile,
    resDogStatuses,
    resDogAppointments,
    resDogPreferredVet,
    resDogReports,
  ] = await Promise.all([
    actor.getDogProfile({ dogId }),
    actor.getDogStatuses({ dogId }),
    actor.getDogAppointments({ dogId }),
    actor.getDogPreferredVet({ dogId }),
    actor.getDogReports({ dogId }),
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
