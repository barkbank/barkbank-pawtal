"use server";

import APP from "@/lib/app";
import { RegistrationRequest } from "@/lib/services/registration";
import { CODE } from "@/lib/utilities/bark-code";

export async function registerNewUser(
  request: RegistrationRequest,
): Promise<
  | typeof CODE.OK
  | typeof CODE.ERROR_INVALID_OTP
  | typeof CODE.ERROR_ACCOUNT_ALREADY_EXISTS
  | typeof CODE.FAILED
> {
  const service = await APP.getRegistrationService();
  return service.handle(request);
}
