"use server";

import nodemailer from "nodemailer";
import { Err, Ok, Result } from "./result";
import { guaranteed } from "./stringutils";
import Mail from "nodemailer/lib/mailer";

function getNodemailerEmailTransport() {
  const TRANSPORT = nodemailer.createTransport({
    host: guaranteed(process.env.SMTP_HOST),
    port: parseInt(guaranteed(process.env.SMTP_PORT)),
    secure: true,
    auth: {
      user: guaranteed(process.env.SMTP_USER),
      pass: guaranteed(process.env.SMTP_PASSWORD),
    },
  });

  async function sendFn(options: Mail.Options): Promise<{ messageId: string }> {
    return TRANSPORT.sendMail(options);
  }

  return sendFn;
}

function getPassThroughEmailTransport() {
  async function sendFn(options: Mail.Options): Promise<{ messageId: string }> {
    console.log(options);
    return { messageId: "message1" };
  }

  return sendFn;
}

const emailTransport =
  guaranteed(process.env.SMTP_HOST) === ""
    ? getPassThroughEmailTransport()
    : getNodemailerEmailTransport();

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
