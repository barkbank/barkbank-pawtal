import { getAuthenticatedUserActor } from "@/lib/auth";
import { DogPreferredVet } from "@/lib/bark/models/dog-preferred-vet";
import { DogAppointment } from "@/lib/bark/models/dog-appointment";
import { DogProfile } from "@/lib/bark/models/dog-profile";
import { DogStatuses } from "@/lib/bark/models/dog-statuses";
import { RoutePath } from "@/lib/route-path";
import { getDogAppointments } from "@/lib/user/actions/get-dog-appointments";
import { getDogPreferredVet } from "@/lib/user/actions/get-dog-preferred-vet";
import { getDogProfile } from "@/lib/user/actions/get-dog-profile";
import { getDogStatuses } from "@/lib/user/actions/get-dog-statuses";
import { UserActor } from "@/lib/user/user-actor";
import { CODE } from "@/lib/utilities/bark-code";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { redirect } from "next/navigation";
import { DogViewer } from "../../_lib/components/dog-viewer";

async function getPageData(
  actor: UserActor,
  dogId: string,
): Promise<
  Result<
    {
      dogProfile: DogProfile;
      dogStatuses: DogStatuses;
      dogAppointments: DogAppointment[];
      dogPreferredVet: DogPreferredVet | null;
    },
    | typeof CODE.ERROR_DOG_NOT_FOUND
    | typeof CODE.ERROR_WRONG_OWNER
    | typeof CODE.DB_QUERY_FAILURE
    | typeof CODE.ERROR_MORE_THAN_ONE_PREFERRED_VET
  >
> {
  const [
    resDogProfile,
    resDogStatuses,
    resDogAppointments,
    resDogPreferredVet,
  ] = await Promise.all([
    getDogProfile(actor, dogId),
    getDogStatuses(actor, dogId),
    getDogAppointments(actor, dogId),
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
    dogProfile: resDogProfile.result,
    dogStatuses: resDogStatuses.result,
    dogAppointments: resDogAppointments.result,
    dogPreferredVet: resDogPreferredVet.result,
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
  const { dogProfile, dogStatuses, dogAppointments, dogPreferredVet } = result;

  // WIP: === REFACTORING STEPS ===
  // DONE: Move db-enums into bark/enums with Zod schemas.
  // DONE: Move dog-models into bark/models with Zod schemas.
  // DONE: Extract the following into a DogViewer component inside page.tsx first.
  // DONE: Then move DogViewer into _lib/components/dog-viewer.tsx with all the view components and functions.
  // WIP: Extract from DogViewer components DogStatus and DogProfile
  // WIP: Create a _lib/components/dog-viewer directory.
  // WIP: Move DogStatus into .../dog-viewer/dog-status.tsx
  // WIP: Move DogProfile, ProfileItem, and Warning into .../dog-viewer/dog-profile.tsx
  // WIP: === Regroup, think of next steps ===

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
