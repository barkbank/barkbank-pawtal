"use server";

import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { DogProfileSpec } from "@/lib/bark/models/dog-profile-models";
import { CODE } from "@/lib/utilities/bark-code";
import { revalidatePath } from "next/cache";

export async function postDogProfileUpdate(args: {
  dogId: string;
  dogProfile: DogProfileSpec;
}): Promise<
  | typeof CODE.OK
  | typeof CODE.ERROR_NOT_LOGGED_IN
  | typeof CODE.ERROR_CANNOT_UPDATE_FULL_PROFILE
  | typeof CODE.ERROR_WRONG_OWNER
  | typeof CODE.ERROR_DOG_NOT_FOUND
  | typeof CODE.DB_QUERY_FAILURE
  | typeof CODE.FAILED
> {
  const { dogId, dogProfile } = args;
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    return CODE.ERROR_NOT_LOGGED_IN;
  }
  const { error } = await actor.updateDogProfile({ dogId, spec: dogProfile });
  if (error !== undefined) {
    return error;
  }
  revalidatePath(RoutePath.USER_MY_PETS, "layout");
  return CODE.OK;
}
