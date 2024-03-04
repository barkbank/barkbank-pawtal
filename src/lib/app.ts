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

export class AppFactory {
  private envs: NodeJS.Dict<string>;
  private promisedEmailService: Promise<EmailService> | null = null;
  private promisedOtpService: Promise<OtpService> | null = null;
  private promisedPiiHashService: Promise<HashService> | null = null;
  private promisedPiiEncryptionService: Promise<EncryptionService> | null =
    null;
  private promisedBreedService: Promise<BreedService> | null = null;
  private dbPool: pg.Pool | null = null;
  private adminActorFactory: AdminActorFactory | null = null;
  private vetActorFactory: VetActorFactory | null = null;
  private userActorFactory: UserActorFactory | null = null;

  constructor(envs: NodeJS.Dict<string>) {
    this.envs = envs;
  }

  private envOptionalString(key: string): string | undefined {
    return this.envs[key];
  }

  private envString(key: string): string {
    const value = this.envOptionalString(key);
    if (value === undefined) {
      throw Error(`${key} is not specified`);
    }
    return value;
  }

  private envInteger(key: string): number {
    return parseInt(this.envString(key));
  }

  public getNodeEnv(): "development" | "production" | "test" {
    const val = this.envOptionalString("NODE_ENV");
    if (val === "production" || val === "test") {
      return val;
    }
    return "development";
  }

  public getDangerousApiIsEnabled(): boolean {
    if (this.getNodeEnv() === "production") {
      return false;
    }
    return this.envOptionalString("DANGEROUS_ENABLED") === "true";
  }

  public async getEmailService(): Promise<EmailService> {
    const self = this;

    function resolveEmailSender(): EmailSender {
      if (self.envString("BARKBANK_SMTP_HOST") === "") {
        console.log("Using PassthroughEmailSender");
        return new PassthroughEmailSender();
      }
      const config: SmtpConfig = {
        smtpHost: self.envString("BARKBANK_SMTP_HOST"),
        smtpPort: self.envInteger("BARKBANK_SMTP_PORT"),
        smtpUser: self.envString("BARKBANK_SMTP_USER"),
        smtpPassword: self.envString("BARKBANK_SMTP_PASSWORD"),
      };
      console.log("Using NodemailerEmailSender");
      return new NodemailerEmailSender(config);
    }

    if (this.promisedEmailService === null) {
      this.promisedEmailService = Promise.resolve(
        new EmailService(resolveEmailSender()),
      );
      console.log("Created EmailService");
    }
    return this.promisedEmailService;
  }

  public async getOtpService(): Promise<OtpService> {
    if (this.promisedOtpService === null) {
      const config: OtpConfig = {
        otpLength: 6,
        otpPeriodMillis: this.envInteger("BARKBANK_OTP_PERIOD_MILLIS"),
        otpRecentPeriods: this.envInteger("BARKBANK_OTP_NUM_RECENT_PERIODS"),
        otpHashService: new SecretHashService(
          this.envString("BARKBANK_OTP_SECRET"),
        ),
      };
      this.promisedOtpService = Promise.resolve(new OtpService(config));
      console.log("Created OtpService");
    }
    return this.promisedOtpService;
  }

  public async getSenderForOtpEmail(): Promise<EmailContact> {
    return {
      email: this.envString("BARKBANK_OTP_SENDER_EMAIL"),
      name: this.envOptionalString("BARKBANK_OTP_SENDER_NAME"),
    };
  }

  public async getEmailHashService(): Promise<HashService> {
    if (this.promisedPiiHashService === null) {
      this.promisedPiiHashService = Promise.resolve(
        new SecretHashService(this.envString("BARKBANK_PII_SECRET")),
      );
      console.log("Created EmailHashService");
    }
    return this.promisedPiiHashService;
  }

  public async getPiiEncryptionService(): Promise<EncryptionService> {
    if (this.promisedPiiEncryptionService === null) {
      this.promisedPiiEncryptionService = Promise.resolve(
        new SecretEncryptionService(this.envString("BARKBANK_PII_SECRET")),
      );
      console.log("Created PiiEncryptionService");
    }
    return this.promisedPiiEncryptionService;
  }

  public async getBreedService(): Promise<BreedService> {
    if (this.promisedBreedService === null) {
      this.promisedBreedService = Promise.resolve(new BreedService());
      console.log("Created BreedService");
    }
    return this.promisedBreedService;
  }

  public async getDbPool(): Promise<pg.Pool> {
    if (!this.dbPool) {
      this.dbPool = new pg.Pool({
        host: this.envString("BARKBANK_DB_HOST"),
        port: this.envInteger("BARKBANK_DB_PORT"),
        user: this.envString("BARKBANK_DB_USER"),
        password: this.envString("BARKBANK_DB_PASSWORD"),
        database: this.envString("BARKBANK_DB_NAME"),
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

const APP: AppFactory = new AppFactory(process.env);
export default APP;
