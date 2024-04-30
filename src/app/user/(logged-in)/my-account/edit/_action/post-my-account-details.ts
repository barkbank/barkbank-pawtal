"use server";

import { getAuthenticatedUserActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { updateMyAccountDetails } from "@/lib/user/actions/update-my-account-details";
import { MyAccountDetailsUpdate } from "@/lib/user/user-models";
import { BARK_CODE } from "@/lib/utilities/bark-code";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function postMyAccountDetails(
  request: MyAccountDetailsUpdate,
): Promise<typeof BARK_CODE.OK | typeof BARK_CODE.FAILED> {
  const actor = await getAuthenticatedUserActor();
  if (actor === null) {
    redirect(RoutePath.USER_LOGIN_PAGE);
  }

  const response = await updateMyAccountDetails(actor, request);
  if (response === BARK_CODE.OK) {
    revalidatePath("/user/(logged-in)/my-account");
    return BARK_CODE.OK;
  }
  return BARK_CODE.FAILED;
}
