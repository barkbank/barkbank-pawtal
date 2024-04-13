"use server";

import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { getMyAccount } from "@/lib/user/actions/get-my-account";
import { updateMyAccountDetails } from "@/lib/user/actions/update-my-account-details";
import { MyAccountDetailsUpdate } from "@/lib/user/user-models";
import { redirect } from "next/navigation";

export type UpdateAccountDetailsResponse =
  | "STATUS_204_UPDATED"
  | "STATUS_500_INTERNAL_SERVER_ERROR";

export async function updateAccountDetails(
  request: MyAccountDetailsUpdate,
): Promise<UpdateAccountDetailsResponse> {
  const actor = await getAuthenticatedUserActor();
  if (!actor) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }
  const account = await getMyAccount(actor);
  if (!account) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }

  const response = await updateMyAccountDetails(actor, request);
  if (response === "OK_UPDATED") {
    return "STATUS_204_UPDATED";
  }
  return "STATUS_500_INTERNAL_SERVER_ERROR";
}
