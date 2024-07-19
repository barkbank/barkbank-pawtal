import nodemailer from "nodemailer";
import { Err, Ok, Result } from "../utilities/result";
import { z } from "zod";

export const EmailContactSchema = z.object({
  email: z.string(),
  name: z.string().optional(),
});

export type EmailContact = z.infer<typeof EmailContactSchema>;

export const EmailSchema = z.object({
  sender: EmailContactSchema,
  recipient: EmailContactSchema,
  subject: z.string(),
  bodyText: z.string().optional(),
  bodyHtml: z.string().optional(),
});

export type Email = z.infer<typeof EmailSchema>;

export interface EmailService {
  sendEmail: (email: Email) => Promise<Result<true, "FAILED">>;
}

export class PassthroughEmailService implements EmailService {
  public async sendEmail(email: Email): Promise<Result<true, "FAILED">> {
    console.log("PassthroughEmailTransport::sendEmail:", email);
    return Ok(true);
  }
}

export type SmtpConfig = {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
};

export class NodemailerEmailService implements EmailService {
  private transport: nodemailer.Transporter;

  public constructor(config: SmtpConfig) {
    this.transport = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: true,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPassword,
      },
    });
  }

  public async sendEmail(email: Email): Promise<Result<true, "FAILED">> {
    const { sender, recipient, subject, bodyText, bodyHtml } = email;
    try {
      await this.transport.sendMail({
        from: this.formatContact(sender),
        to: this.formatContact(recipient),
        subject: subject,
        text: bodyText,
        html: bodyHtml,
      });
      return Ok(true);
    } catch (err) {
      console.error(err);
      return Err("FAILED");
    }
  }

  private formatContact(contact: EmailContact): string {
    if (contact.name) {
      return `"${contact.name}" <${contact.email}>`;
    }
    return contact.email;
  }
}
