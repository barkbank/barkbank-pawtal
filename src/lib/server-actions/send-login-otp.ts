"use server";

import APP from "@/lib/app";
import { Email } from "@/lib/services/email";

// WIP: the business logic should be in an OtpEmailService.
// - it should be constructed from otp service, email service, and sender for otp email.
export async function sendLoginOtp(emailAddress: string): Promise<void> {
  console.log("Sending OTP to", emailAddress);
  const emailService = await APP.getEmailService();
  const otpService = await APP.getOtpService();
  const otp = await otpService.getCurrentOtp(emailAddress);
  const sender = await APP.getSenderForOtpEmail();
  const email: Email = {
    sender,
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
