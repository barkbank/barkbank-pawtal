"use server";

import APP from "@/lib/app";
import { opSendWelcomeEmail } from "@/lib/bark/operations/op-send-welcome-email";
import { RegistrationRequest } from "@/lib/services/registration";
import { CODE } from "@/lib/utilities/bark-code";

export async function postRegistrationRequest(
  request: RegistrationRequest,
): Promise<
  | typeof CODE.OK
  | typeof CODE.ERROR_INVALID_OTP
  | typeof CODE.ERROR_ACCOUNT_ALREADY_EXISTS
  | typeof CODE.FAILED
> {
  const service = await APP.getRegistrationService();
  const res = await service.handle(request);
  if (res !== CODE.OK) {
    return res;
  }
  const context = await APP.getBarkContext();
  const { userEmail, userName, dogName, dogPreferredVetId } = request;
  const hasPreferredVet =
    dogPreferredVetId !== undefined && dogPreferredVetId !== "";
  await opSendWelcomeEmail(context, {
    userEmail,
    userName,
    dogName,
    hasPreferredVet,
  });
  return res;
}
