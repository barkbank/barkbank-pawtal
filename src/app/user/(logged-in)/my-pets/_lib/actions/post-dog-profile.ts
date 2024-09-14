"use server";

import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { DogProfileSpec } from "@/lib/bark/models/dog-profile-models";
import { CODE } from "@/lib/utilities/bark-code";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { revalidatePath } from "next/cache";

export async function postDogProfile(
  dogProfile: DogProfileSpec,
): Promise<
  Result<
    { dogId: string },
    typeof CODE.ERROR_NOT_LOGGED_IN | typeof CODE.FAILED
  >
> {
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    return Err(CODE.ERROR_NOT_LOGGED_IN);
  }
  const { result, error } = await actor.addDogProfile({spec: dogProfile})
  if (error !== undefined) {
    return Err(CODE.FAILED);
  }
  revalidatePath(RoutePath.USER_MY_PETS, "layout");
  return Ok(result);
}
