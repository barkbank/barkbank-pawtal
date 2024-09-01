"use server";

import { getAuthenticatedAdminActor } from "@/lib/auth";
import {
  AdminAccountSpec,
  AdminIdentifier,
} from "@/lib/bark/models/admin-models";
import { CODE } from "@/lib/utilities/bark-code";
import { Err, Result } from "@/lib/utilities/result";

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
  return actor.createAdminAccount({ spec });
}
