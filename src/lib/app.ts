import {
  EmailContact,
  EmailSender,
  EmailService,
  NodemailerEmailSender,
  PassthroughEmailSender,
  SmtpConfig,
} from "./services/email";
import { OtpConfig, OtpService } from "./services/otp";
import { guaranteed } from "./stringutils";

class AppFactory {
  private emailService: EmailService | null = null;
  private otpService: OtpService | null = null;

  public async getEmailService(): Promise<EmailService> {
    if (!this.emailService) {
      this.emailService = new EmailService(this.getEmailSender());
      console.log("Created EmailService");
    }
    return this.emailService;
  }

  public async getOtpService(): Promise<OtpService> {
    if (!this.otpService) {
      const config: OtpConfig = {
        otpLength: 6,
        otpPeriodMillis: parseInt(guaranteed(process.env.OTP_PERIOD_MILLIS)),
        otpRecentPeriods: parseInt(
          guaranteed(process.env.OTP_NUM_RECENT_PERIODS),
        ),
        otpServerSecret: guaranteed(process.env.OTP_SECRET),
      };
      this.otpService = new OtpService(config);
    }
    return this.otpService;
  }

  public getSenderForOtpEmail(): EmailContact {
    return {
      email: guaranteed(process.env.OTP_SENDER_EMAIL),
      name: process.env.OTP_SENDER_NAME,
    };
  }

  private getEmailSender(): EmailSender {
    if (guaranteed(process.env.SMTP_HOST) === "") {
      console.log("Using PassthroughEmailSender");
      return new PassthroughEmailSender();
    }
    const config: SmtpConfig = {
      smtpHost: guaranteed(process.env.SMTP_HOST),
      smtpPort: parseInt(guaranteed(process.env.SMTP_PORT)),
      smtpUser: guaranteed(process.env.SMTP_USER),
      smtpPassword: guaranteed(process.env.SMTP_PASSWORD),
    };
    console.log("Using NodemailerEmailSender");
    return new NodemailerEmailSender(config);
  }
}

const APP: AppFactory = new AppFactory();
export default APP;
