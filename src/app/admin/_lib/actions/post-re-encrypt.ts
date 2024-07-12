"use server";

import APP from "@/lib/app";
import { getAuthenticatedAdminActor } from "@/lib/auth";
import { ReEncryptResult } from "@/lib/bark/models/re-encrypt-result";
import { opReEncrypt } from "@/lib/bark/operations/op-re-encrypt";
import { CODE } from "@/lib/utilities/bark-code";
import { Err, Ok, Result } from "@/lib/utilities/result";

export async function postReEncrypt(): Promise<
  Result<ReEncryptResult, typeof CODE.ERROR_NOT_LOGGED_IN | typeof CODE.FAILED>
> {
  const actor = await getAuthenticatedAdminActor();
  if (actor === null) {
    return Err(CODE.ERROR_NOT_LOGGED_IN);
  }
  const context = await APP.getBarkContext();
  const { result, error } = await opReEncrypt(context);
  if (error !== undefined) {
    return Err(error);
  }
  return Ok(result);
}
