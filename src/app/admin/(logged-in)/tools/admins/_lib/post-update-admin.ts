"use server";

import { getAuthenticatedAdminActor } from "@/lib/auth";
import { AdminAccountSpec } from "@/lib/bark/models/admin-models";
import { RoutePath } from "@/lib/route-path";
import { CODE } from "@/lib/utilities/bark-code";
import { revalidatePath } from "next/cache";

export async function postUpdateAdmin(args: {
  adminId: string;
  spec: AdminAccountSpec;
}) {
  const actor = await getAuthenticatedAdminActor();
  if (actor === null) {
    return CODE.ERROR_NOT_LOGGED_IN;
  }
  const { adminId, spec } = args;
  const res = await actor.updateAdminAccount({ adminId, spec });
  if (res === CODE.OK) {
    revalidatePath(RoutePath.ADMIN_TOOLS_ADMINS_SUBTREE, "layout");
  }
  return res;
}
