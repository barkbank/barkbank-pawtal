"use server";

import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { addMyDog } from "@/lib/user/actions/add-my-dog";
import { DogProfile } from "@/lib/bark/models/dog-profile";
import { CODE } from "@/lib/utilities/bark-code";
import { Err, Ok, Result } from "@/lib/utilities/result";
import { revalidatePath } from "next/cache";

export async function postDogProfile(
  dogProfile: DogProfile,
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
  const { result, error } = await addMyDog(actor, dogProfile);
  if (error !== undefined) {
    return Err(CODE.FAILED);
  }
  revalidatePath(RoutePath.USER_MY_PETS, "layout");
  return Ok(result);
}
