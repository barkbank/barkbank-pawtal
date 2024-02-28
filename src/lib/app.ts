import { AdminActorFactory } from "./admin/admin-actor-factory";
import { BreedService } from "./services/breed";
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
import pg from "pg";
import { VetActorFactory } from "./vet/vet-actor-factory";
import { UserActorFactory } from "./user/user-actor-factory";

class AppFactory {
  private emailService: EmailService | null = null;
  private otpService: OtpService | null = null;
  private piiHashService: HashService | null = null;
  private piiEncryptionService: EncryptionService | null = null;
  private breedService: BreedService | null = null;
  private dbPool: pg.Pool | null = null;
  private adminActorFactory: AdminActorFactory | null = null;
  private vetActorFactory: VetActorFactory | null = null;
  private userActorFactory: UserActorFactory | null = null;

  public async getEmailService(): Promise<EmailService> {
    function resolveEmailSender(): EmailSender {
      if (envString("BARKBANK_SMTP_HOST") === "") {
        console.log("Using PassthroughEmailSender");
        return new PassthroughEmailSender();
      }
      const config: SmtpConfig = {
        smtpHost: envString("BARKBANK_SMTP_HOST"),
        smtpPort: envInteger("BARKBANK_SMTP_PORT"),
        smtpUser: envString("BARKBANK_SMTP_USER"),
        smtpPassword: envString("BARKBANK_SMTP_PASSWORD"),
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
        otpPeriodMillis: envInteger("BARKBANK_OTP_PERIOD_MILLIS"),
        otpRecentPeriods: envInteger("BARKBANK_OTP_NUM_RECENT_PERIODS"),
        otpHashService: new SecretHashService(envString("BARKBANK_OTP_SECRET")),
      };
      this.otpService = new OtpService(config);
      console.log("Created OtpService");
    }
    return this.otpService;
  }

  public async getSenderForOtpEmail(): Promise<EmailContact> {
    return {
      email: envString("BARKBANK_OTP_SENDER_EMAIL"),
      name: envOptionalString("BARKBANK_OTP_SENDER_NAME"),
    };
  }

  public async getEmailHashService(): Promise<HashService> {
    if (!this.piiHashService) {
      this.piiHashService = new SecretHashService(
        envString("BARKBANK_PII_SECRET"),
      );
      console.log("Created EmailHashService");
    }
    return this.piiHashService;
  }

  public async getPiiEncryptionService(): Promise<EncryptionService> {
    if (!this.piiEncryptionService) {
      this.piiEncryptionService = new SecretEncryptionService(
        envString("BARKBANK_PII_SECRET"),
      );
      console.log("Created PiiEncryptionService");
    }
    return this.piiEncryptionService;
  }

  public async getBreedService(): Promise<BreedService> {
    if (!this.breedService) {
      this.breedService = new BreedService();
      console.log("Created BreedService");
    }
    return this.breedService;
  }

  public async getDbPool(): Promise<pg.Pool> {
    if (!this.dbPool) {
      this.dbPool = new pg.Pool({
        host: envString("BARKBANK_DB_HOST"),
        port: envInteger("BARKBANK_DB_PORT"),
        user: envString("BARKBANK_DB_USER"),
        password: envString("BARKBANK_DB_PASSWORD"),
        database: envString("BARKBANK_DB_NAME"),
      });
      console.log("Created database connection pool");
    }
    return this.dbPool;
  }

  public async getAdminActorFactory(): Promise<AdminActorFactory> {
    if (!this.adminActorFactory) {
      const dbPool = await this.getDbPool();
      const emailHashService = await this.getEmailHashService();
      const piiEncryptionService = await this.getPiiEncryptionService();
      this.adminActorFactory = new AdminActorFactory({
        dbPool,
        emailHashService,
        piiEncryptionService,
      });
      console.log("Created AdminActorFactory");
    }
    return this.adminActorFactory;
  }

  public async getVetActorFactory(): Promise<VetActorFactory> {
    if (!this.vetActorFactory) {
      const dbPool = await this.getDbPool();
      const piiEncryptionService = await this.getPiiEncryptionService();
      this.vetActorFactory = new VetActorFactory({
        dbPool,
        piiEncryptionService,
      });
      console.log("Created VetActorFactory");
    }
    return this.vetActorFactory;
  }

  public async getUserActorFactory(): Promise<UserActorFactory> {
    if (!this.userActorFactory) {
      const dbPool = await this.getDbPool();
      const emailHashService = await this.getEmailHashService();
      const piiEncryptionService = await this.getPiiEncryptionService();
      this.userActorFactory = new UserActorFactory({
        dbPool,
        emailHashService,
        piiEncryptionService,
      });
      console.log("Created UserActorFactory");
    }
    return this.userActorFactory;
  }
}

function envOptionalString(key: string): string | undefined {
  return process.env[key];
}

function envString(key: string): string {
  const value = envOptionalString(key);
  if (value === undefined) {
    throw Error(`${key} is not specified`);
  }
  return value;
}

function envInteger(key: string): number {
  return parseInt(envString(key));
}

const APP: AppFactory = new AppFactory();
export default APP;
