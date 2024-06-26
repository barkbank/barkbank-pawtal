"use server";

import { getAuthenticatedUserActor } from "@/lib/auth";
import { SubProfile } from "@/lib/bark/models/sub-profile";
import { RoutePath } from "@/lib/route-path";
import { updateSubProfile } from "@/lib/user/actions/update-sub-profile";
import { CODE } from "@/lib/utilities/bark-code";
import { revalidatePath } from "next/cache";

export async function postSubProfileUpdate(args: {
  dogId: string;
  subProfile: SubProfile;
}): Promise<
  | typeof CODE.OK
  | typeof CODE.DB_QUERY_FAILURE
  | typeof CODE.ERROR_WRONG_OWNER
  | typeof CODE.ERROR_DOG_NOT_FOUND
  | typeof CODE.ERROR_SHOULD_UPDATE_FULL_PROFILE
  | typeof CODE.FAILED
  | typeof CODE.ERROR_NOT_LOGGED_IN
> {
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    return CODE.ERROR_NOT_LOGGED_IN;
  }
  const { dogId, subProfile } = args;
  const error = await updateSubProfile(actor, dogId, subProfile);
  if (error !== CODE.OK) {
    return error;
  }
  revalidatePath(RoutePath.USER_MY_PETS, "layout");
  return CODE.OK;
}
