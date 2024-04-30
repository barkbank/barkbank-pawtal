"use server";

import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { updateDogProfile } from "@/lib/user/actions/update-dog-profile";
import { DogProfile } from "@/lib/user/user-models";
import { BARK_CODE } from "@/lib/utilities/bark-code";
import { revalidatePath } from "next/cache";

// WIP: rename to postDogProfileUpdate
export async function updateDogProfileAction(args: {
  dogId: string;
  dogProfile: DogProfile;
}): Promise<
  | typeof BARK_CODE.OK
  | typeof BARK_CODE.ERROR_NOT_LOGGED_IN
  | typeof BARK_CODE.ERROR_CANNOT_UPDATE_FULL_PROFILE
  | typeof BARK_CODE.ERROR_WRONG_OWNER
  | typeof BARK_CODE.ERROR_DOG_NOT_FOUND
  | typeof BARK_CODE.DB_QUERY_FAILURE
  | typeof BARK_CODE.EXCEPTION
> {
  const { dogId, dogProfile } = args;
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    return BARK_CODE.ERROR_NOT_LOGGED_IN;
  }
  const res = await updateDogProfile(actor, dogId, dogProfile);
  if (res === BARK_CODE.OK) {
    revalidatePath(RoutePath.USER_MY_PETS, "layout");
    return BARK_CODE.OK;
  }
  return res;
}
