"use server";

import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { updateMyAccountDetails } from "@/lib/user/actions/update-my-account-details";
import { MyAccountDetailsUpdate } from "@/lib/user/user-models";
import { CODE } from "@/lib/utilities/bark-code";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function postMyAccountDetails(
  request: MyAccountDetailsUpdate,
): Promise<typeof CODE.OK | typeof CODE.FAILED> {
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }

  const response = await updateMyAccountDetails(actor, request);
  if (response === CODE.OK) {
    revalidatePath("/user/(logged-in)/my-account");
    return CODE.OK;
  }
  return CODE.FAILED;
}
