"use server";

import APP from "@/lib/app";
import { AccountType } from "../auth-models";

// WIP: Use BARK_CODE
type ResponseCode = "OK" | "NO_ACCOUNT" | "SEND_FAILED";

export async function sendLoginOtp(args: {
  emailAddress: string;
  accountType: AccountType | null;
}): Promise<ResponseCode> {
  const emailOtpService = await APP.getEmailOtpService();
  return emailOtpService.sendOtp(args);
}
