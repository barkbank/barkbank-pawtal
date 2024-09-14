"use server";

import { getAuthenticatedUserActor } from "@/lib/auth";
import { SubProfileSpec } from "@/lib/bark/models/dog-profile-models";
import { RoutePath } from "@/lib/route-path";
import { CODE } from "@/lib/utilities/bark-code";
import { revalidatePath } from "next/cache";

export async function postSubProfileUpdate(args: {
  dogId: string;
  subProfile: SubProfileSpec;
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
  const { error } = await actor.updateSubProfile({ dogId, spec: subProfile });
  if (error !== undefined) {
    return error;
  }
  revalidatePath(RoutePath.USER_MY_PETS, "layout");
  return CODE.OK;
}
