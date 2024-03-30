import nodemailer from "nodemailer";
import { Err, Ok, Result } from "../utilities/result";

export type EmailContact = {
  email: string;
  name?: string;
};

export type Email = {
  sender: EmailContact;
  recipient: EmailContact;
  subject: string;
  bodyText?: string;
  bodyHtml?: string;
};

export interface EmailSender {
  sendEmail: (email: Email) => Promise<Result<true, "FAILED">>;
}

export class PassthroughEmailSender implements EmailSender {
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

export class NodemailerEmailSender implements EmailSender {
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

export class EmailService implements EmailSender {
  private transport: EmailSender;

  public constructor(transport: EmailSender) {
    this.transport = transport;
  }

  public async sendEmail(email: Email): Promise<Result<true, "FAILED">> {
    return this.transport.sendEmail(email);
  }
}
