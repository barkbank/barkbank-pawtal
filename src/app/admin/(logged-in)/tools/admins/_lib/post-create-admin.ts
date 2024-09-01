"use server";

import { getAuthenticatedAdminActor } from "@/lib/auth";
import {
  AdminAccountSpec,
  AdminIdentifier,
} from "@/lib/bark/models/admin-models";
import { RoutePath } from "@/lib/route-path";
import { CODE } from "@/lib/utilities/bark-code";
import { Err, Result } from "@/lib/utilities/result";
import { revalidatePath } from "next/cache";

export async function postCreateAdmin(args: {
  spec: AdminAccountSpec;
}): Promise<
  Result<AdminIdentifier, typeof CODE.ERROR_NOT_LOGGED_IN | typeof CODE.FAILED>
> {
  const actor = await getAuthenticatedAdminActor();
  if (actor === null) {
    return Err(CODE.ERROR_NOT_LOGGED_IN);
  }
  const { spec } = args;
  const res = await actor.createAdminAccount({ spec });
  if (res.error === undefined) {
    revalidatePath(RoutePath.ADMIN_TOOLS_ADMINS_SUBTREE, "layout");
  }
  return res;
}
