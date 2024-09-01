"use server";

import { getAuthenticatedAdminActor } from "@/lib/auth";
import { RoutePath } from "@/lib/route-path";
import { CODE } from "@/lib/utilities/bark-code";
import { revalidatePath } from "next/cache";

export async function postDeleteAdmin(args: { adminId: string }) {
  const actor = await getAuthenticatedAdminActor();
  if (actor === null) {
    return CODE.ERROR_NOT_LOGGED_IN;
  }
  const { adminId } = args;
  const res = await actor.deleteAdminAccount({ adminId });
  if (res === CODE.OK) {
    revalidatePath(RoutePath.ADMIN_TOOLS_ADMINS_SUBTREE, "layout");
  }
  return res;
}
