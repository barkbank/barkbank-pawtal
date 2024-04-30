"use server";

import APP from "@/lib/app";
import { AccountType } from "../auth-models";
import { CODE } from "../utilities/bark-code";

export async function postOtpRequest(args: {
  emailAddress: string;
  accountType: AccountType | null;
}): Promise<
  typeof CODE.OK | typeof CODE.ERROR_ACCOUNT_NOT_FOUND | typeof CODE.FAILED
> {
  const emailOtpService = await APP.getEmailOtpService();
  return emailOtpService.sendOtp(args);
}
