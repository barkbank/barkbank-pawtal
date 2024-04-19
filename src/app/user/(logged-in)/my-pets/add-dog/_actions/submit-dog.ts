"use server";

import { getAuthenticatedUserActor } from "@/lib/auth";
import { addMyDog } from "@/lib/user/actions/add-my-dog";
import { MyDogRegistration } from "@/lib/user/user-models";
import { Err, Result } from "@/lib/utilities/result";

export async function submitDog(
  reg: MyDogRegistration,
): Promise<Result<{ dogId: string }, "FAILED" | "ERROR_UNAUTHORIZED">> {
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    return Err("ERROR_UNAUTHORIZED");
  }
  return addMyDog(actor, reg);
}
