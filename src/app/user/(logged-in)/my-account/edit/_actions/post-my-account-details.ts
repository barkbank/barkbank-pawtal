"use server";

import { getAuthenticatedUserActor } from "@/lib/auth";
import { UserAccountUpdate } from "@/lib/bark/models/user-models";
import { updateMyAccountDetails } from "@/lib/user/actions/update-my-account-details";
import { CODE } from "@/lib/utilities/bark-code";
import { revalidatePath } from "next/cache";

export async function postMyAccountDetails(
  request: UserAccountUpdate,
): Promise<
  typeof CODE.OK | typeof CODE.ERROR_NOT_LOGGED_IN | typeof CODE.FAILED
> {
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    return CODE.ERROR_NOT_LOGGED_IN;
  }

  const response = await updateMyAccountDetails(actor, request);
  if (response === CODE.OK) {
    revalidatePath("/user/(logged-in)/my-account");
    return CODE.OK;
  }
  return CODE.FAILED;
}
