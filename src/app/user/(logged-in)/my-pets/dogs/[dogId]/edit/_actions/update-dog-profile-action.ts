import { getAuthenticatedUserActor } from "@/lib/auth";
import { updateDogProfile } from "@/lib/user/actions/update-dog-profile";
import { DogProfile } from "@/lib/user/user-models";

type ResponseCode =
  | "ERROR_NOT_LOGGED_IN"
  | "OK_UPDATED"
  | "ERROR_UNAUTHORIZED"
  | "ERROR_REPORT_EXISTS"
  | "ERROR_MISSING_DOG"
  | "FAILURE_DB_UPDATE";

export async function updateDogProfileAction(args: {
  dogId: string;
  dogProfile: DogProfile;
}): Promise<ResponseCode> {
  const { dogId, dogProfile } = args;
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    return "ERROR_NOT_LOGGED_IN";
  }
  const res = await updateDogProfile(actor, dogId, dogProfile);
  return res;
}
