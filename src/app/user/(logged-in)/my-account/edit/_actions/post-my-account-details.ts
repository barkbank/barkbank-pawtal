"use server";

import { getAuthenticatedUserActor } from "@/lib/auth";
import { updateMyAccountDetails } from "@/lib/user/actions/update-my-account-details";
import { MyAccountDetailsUpdate } from "@/lib/user/user-models";
import { CODE } from "@/lib/utilities/bark-code";
import { revalidatePath } from "next/cache";

export async function postMyAccountDetails(
  request: MyAccountDetailsUpdate,
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
