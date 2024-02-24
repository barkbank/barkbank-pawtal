"use server";

import APP from "@/lib/app";
import { Email } from "@/lib/services/email";

export async function sendLoginOtp(emailAddress: string): Promise<void> {
  console.log("Sending OTP to", emailAddress);
  const emailService = await APP.getEmailService();
  const otpService = await APP.getOtpService();
  const otp = await otpService.getCurrentOtp(emailAddress);
  const email: Email = {
    sender: APP.getSenderForOtpEmail(),
    recipient: { email: emailAddress },
    subject: "Bark Bank OTP",
    bodyText: `Your Bark Bank OTP is ${otp}`,
    bodyHtml: `<p>Your Bark Bank OTP is <b>${otp}</b></p>`,
  };
  const { result } = await emailService.sendEmail(email);
  if (result) {
    console.log("OTP email was sent to", emailAddress);
  } else {
    console.warn("Failed to send email");
  }
}
