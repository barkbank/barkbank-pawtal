"use server";

import APP from "@/lib/app";
import { AccountType } from "../auth-models";

// WIP: the business logic should be in an OtpEmailService.
// - it should be constructed from otp service, email service, and sender for otp email.
export async function sendLoginOtp(args: {emailAddress: string, accountType: AccountType | null}): Promise<void> {
  const {emailAddress, accountType} = args;
  console.log("Sending OTP to", emailAddress);
  const emailOtpService = await APP.getEmailOtpService();
  const res = await emailOtpService.sendOtp({emailAddress, accountType});
  if (res === "OK") {
    console.log("OTP email was sent to", emailAddress);
  } else {
    console.warn("Failed to send email", res);
  }
}
