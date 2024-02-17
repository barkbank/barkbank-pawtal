"use server";

import { sendEmail } from "@/lib/email";
import { guaranteed } from "@/lib/stringutils";

export async function sendOtp(email: string): Promise<void> {
  console.log("Sending OTP to:", email);
  const { result } = await sendEmail({
    sender: {
      email: guaranteed(process.env.OTP_SENDER_EMAIL),
      name: process.env.OTP_SENDER_NAME,
    },
    recipient: { email },
    subject: "Bark Bank OTP",
    bodyText: "Your Bark Bank OTP is 123456",
    bodyHtml: "<p>Your Bark Bank OTP is <b>123456</b></p>",
  });
  if (result) {
    console.log("Message sent: %s", result.messageId);
  } else {
    console.warn("Failed to send email");
  }
}
