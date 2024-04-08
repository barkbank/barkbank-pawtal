"use server";

import APP from "@/lib/app";
import { AccountType } from "../auth-models";

type ResponseCode = "OK" | "NO_ACCOUNT" | "SEND_FAILED";

export async function sendLoginOtp(args: {
  emailAddress: string;
  accountType: AccountType | null;
}): Promise<ResponseCode> {
  const { emailAddress, accountType } = args;
  const emailOtpService = await APP.getEmailOtpService();
  const res = await emailOtpService.sendOtp({ emailAddress, accountType });
  return res;
}
