"use server";

import APP from "@/lib/app";
import { AccountType } from "../auth-models";

type ResponseCode = "OK" | "NO_ACCOUNT" | "SEND_FAILED";

export async function sendLoginOtp(args: {
  emailAddress: string;
  accountType: AccountType | null;
}): Promise<ResponseCode> {
  const { emailAddress, accountType } = args;
  console.log("Sending OTP to", emailAddress);
  const emailOtpService = await APP.getEmailOtpService();
  const res = await emailOtpService.sendOtp({ emailAddress, accountType });
  if (res === "OK") {
    console.log("OTP email was sent to", emailAddress);
  } else {
    console.warn("Failed to send email", res);
  }
  return res;
}
