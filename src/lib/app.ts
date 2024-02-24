import {
  EmailContact,
  EmailSender,
  EmailService,
  NodemailerEmailSender,
  PassthroughEmailSender,
  SmtpConfig,
} from "./services/email";
import {
  EncryptionService,
  SecretEncryptionService,
} from "./services/encryption";
import { HashService, SecretHashService } from "./services/hash";
import { OtpConfig, OtpService } from "./services/otp";
import { guaranteed } from "./stringutils";

class AppFactory {
  private emailService: EmailService | null = null;
  private otpService: OtpService | null = null;
  private piiHashService: HashService | null = null;
  private piiEncryptionService: EncryptionService | null = null;

  public async getEmailService(): Promise<EmailService> {
    function resolveEmailSender(): EmailSender {
      if (guaranteed(process.env.BARKBANK_SMTP_HOST) === "") {
        console.log("Using PassthroughEmailSender");
        return new PassthroughEmailSender();
      }
      const config: SmtpConfig = {
        smtpHost: guaranteed(process.env.BARKBANK_SMTP_HOST),
        smtpPort: parseInt(guaranteed(process.env.BARKBANK_SMTP_PORT)),
        smtpUser: guaranteed(process.env.BARKBANK_SMTP_USER),
        smtpPassword: guaranteed(process.env.BARKBANK_SMTP_PASSWORD),
      };
      console.log("Using NodemailerEmailSender");
      return new NodemailerEmailSender(config);
    }

    if (!this.emailService) {
      this.emailService = new EmailService(resolveEmailSender());
      console.log("Created EmailService");
    }
    return this.emailService;
  }

  public async getOtpService(): Promise<OtpService> {
    if (!this.otpService) {
      const config: OtpConfig = {
        otpLength: 6,
        otpPeriodMillis: parseInt(
          guaranteed(process.env.BARKBANK_OTP_PERIOD_MILLIS),
        ),
        otpRecentPeriods: parseInt(
          guaranteed(process.env.BARKBANK_OTP_NUM_RECENT_PERIODS),
        ),
        otpHashService: new SecretHashService(
          guaranteed(process.env.BARKBANK_OTP_SECRET),
        ),
      };
      this.otpService = new OtpService(config);
      console.log("Created OtpService");
    }
    return this.otpService;
  }

  public async getSenderForOtpEmail(): Promise<EmailContact> {
    return {
      email: guaranteed(process.env.BARKBANK_OTP_SENDER_EMAIL),
      name: process.env.BARKBANK_OTP_SENDER_NAME,
    };
  }

  public async getPiiHashService(): Promise<HashService> {
    if (!this.piiHashService) {
      this.piiHashService = new SecretHashService(
        guaranteed(process.env.BARKBANK_PII_SECRET),
      );
    }
    return this.piiHashService;
  }

  public async getPiiEncryptionService(): Promise<EncryptionService> {
    if (!this.piiEncryptionService) {
      this.piiEncryptionService = new SecretEncryptionService(
        guaranteed(process.env.BARKBANK_PII_SECRET),
      );
    }
    return this.piiEncryptionService;
  }
}

const APP: AppFactory = new AppFactory();
export default APP;
