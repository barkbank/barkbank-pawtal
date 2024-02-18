"use server";

import nodemailer from "nodemailer";
import { Err, Ok, Result } from "./result";
import { guaranteed } from "./stringutils";
import Mail from "nodemailer/lib/mailer";

type EmailTransportResult = { messageId: string };

async function sendUsingNodemailer(
  options: Mail.Options,
): Promise<EmailTransportResult> {
  const nodemailerTransport = nodemailer.createTransport({
    host: guaranteed(process.env.SMTP_HOST),
    port: parseInt(guaranteed(process.env.SMTP_PORT)),
    secure: true,
    auth: {
      user: guaranteed(process.env.SMTP_USER),
      pass: guaranteed(process.env.SMTP_PASSWORD),
    },
  });
  return nodemailerTransport.sendMail(options);
}

/**
 * Passthrough email transport is used in dev when an SMTP server is not easily
 * available, or too costly to use. It is enabled by assigning an empty string
 * to the SMTP_HOST environment variable. When enabled, the email message will
 * be logged to the console (this should be the server console).
 */
async function passThrough(
  options: Mail.Options,
): Promise<EmailTransportResult> {
  console.log(options);
  return { messageId: "PASSTHROUGH" };
}

async function emailTransport(
  options: Mail.Options,
): Promise<EmailTransportResult> {
  if (guaranteed(process.env.SMTP_HOST) === "") {
    return await passThrough(options);
  } else {
    return await sendUsingNodemailer(options);
  }
}

export type EmailContact = {
  email: string;
  name?: string;
};

/**
 * Sends an email from sender to one recipient
 */
export async function sendEmail(args: {
  sender: EmailContact;
  recipient: EmailContact;
  subject: string;
  bodyText?: string;
  bodyHtml?: string;
}): Promise<Result<{ messageId: string }, "FAILED">> {
  const { sender, recipient, subject, bodyText, bodyHtml } = args;
  try {
    const info = await emailTransport({
      from: formatContact(sender),
      to: formatContact(recipient),
      subject: subject,
      text: bodyText,
      html: bodyHtml,
    });
    return Ok({ messageId: info.messageId });
  } catch (err) {
    console.error(err);
    return Err("FAILED");
  }
}

function formatContact(contact: EmailContact): string {
  if (contact.name) {
    return `"${contact.name}" <${contact.email}>`;
  }
  return contact.email;
}
