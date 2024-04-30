"use server";

import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { updateDogProfile } from "@/lib/user/actions/update-dog-profile";
import { DogProfile } from "@/lib/user/user-models";
import { revalidatePath } from "next/cache";

// WIP: Use BARK_CODE
type ResponseCode =
  | "ERROR_NOT_LOGGED_IN"
  | "OK_UPDATED"
  | "ERROR_UNAUTHORIZED"
  | "ERROR_REPORT_EXISTS"
  | "ERROR_MISSING_DOG"
  | "FAILURE_DB_UPDATE";

// WIP: rename to postDogProfileUpdate
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
  if (res === "OK_UPDATED") {
    revalidatePath(RoutePath.USER_MY_PETS, "layout");
  }
  return res;
}
