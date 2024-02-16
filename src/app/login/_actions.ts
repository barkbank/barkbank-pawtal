"use server";

import nodemailer from "nodemailer";

export async function sendOtp(email: string): Promise<void> {
  console.log("Sending OTP to:", email);
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port:
      process.env.EMAIL_SMTP_PORT === undefined
        ? 465
        : parseInt(process.env.EMAIL_SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Bark Bank OTP",
    text: "Your Bark Bank OTP is 123456",
    html: "<b>Your Bark Bank OTP is 123456</b>",
  });

  console.log("Message sent: %s", info.messageId);
}
