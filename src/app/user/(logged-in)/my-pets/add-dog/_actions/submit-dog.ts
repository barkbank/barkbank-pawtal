"use server";

import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { addMyDog } from "@/lib/user/actions/add-my-dog";
import { DogProfile } from "@/lib/user/user-models";
import { Err, Result } from "@/lib/utilities/result";
import { revalidatePath } from "next/cache";

// WIP: Use BARK_CODE
export async function submitDog(
  dogProfile: DogProfile,
): Promise<Result<{ dogId: string }, "FAILED" | "ERROR_UNAUTHORIZED">> {
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    return Err("ERROR_UNAUTHORIZED");
  }
  const res = await addMyDog(actor, dogProfile);
  if (res.error === undefined) {
    revalidatePath(RoutePath.USER_MY_PETS, "layout");
  }
  return res;
}
