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
import { AppEnv } from "./app-env";
import { isValidEmail } from "./bark-utils";
import { UserAccountService } from "./user/user-account-service";
import { UserMapper } from "./data/user-mapper";
import { AdminMapper } from "./data/admin-mapper";

export class AppFactory {
  private envs: NodeJS.Dict<string>;
  private promisedEmailService: Promise<EmailService> | null = null;
  private promisedOtpService: Promise<OtpService> | null = null;
  private promisedPiiHashService: Promise<HashService> | null = null;
  private promisedPiiEncryptionService: Promise<EncryptionService> | null =
    null;
  private promisedBreedService: Promise<BreedService> | null = null;
  private promisedDbPool: Promise<pg.Pool> | null = null;
  private promisedAdminActorFactory: Promise<AdminActorFactory> | null = null;
  private promisedAdminMapper: Promise<AdminMapper> | null = null;
  private promisedVetActorFactory: Promise<VetActorFactory> | null = null;
  private promisedUserActorFactory: Promise<UserActorFactory> | null = null;
  private promisedUserAccountService: Promise<UserAccountService> | null = null;
  private promisedUserMapper: Promise<UserMapper> | null = null;

  constructor(envs: NodeJS.Dict<string>) {
    this.envs = envs;
  }

  private envOptionalString(key: AppEnv): string | undefined {
    return this.envs[key];
  }

  private envString(key: AppEnv): string {
    const value = this.envOptionalString(key);
    if (value === undefined) {
      throw Error(`${key} is not specified`);
    }
    return value;
  }

  private envInteger(key: AppEnv): number {
    return parseInt(this.envString(key));
  }

  public getNodeEnv(): "development" | "production" | "test" {
    const val = this.envOptionalString(AppEnv.NODE_ENV);
    if (val === "production" || val === "test") {
      return val;
    }
    return "development";
  }

  public getEmailService(): Promise<EmailService> {
    const self = this;

    function resolveEmailSender(): EmailSender {
      if (self.envString(AppEnv.BARKBANK_SMTP_HOST) === "") {
        console.log("Using PassthroughEmailSender");
        return new PassthroughEmailSender();
      }
      const config: SmtpConfig = {
        smtpHost: self.envString(AppEnv.BARKBANK_SMTP_HOST),
        smtpPort: self.envInteger(AppEnv.BARKBANK_SMTP_PORT),
        smtpUser: self.envString(AppEnv.BARKBANK_SMTP_USER),
        smtpPassword: self.envString(AppEnv.BARKBANK_SMTP_PASSWORD),
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

  public getOtpService(): Promise<OtpService> {
    if (this.promisedOtpService === null) {
      const config: OtpConfig = {
        otpLength: 6,
        otpPeriodMillis: this.envInteger(AppEnv.BARKBANK_OTP_PERIOD_MILLIS),
        otpRecentPeriods: this.envInteger(
          AppEnv.BARKBANK_OTP_NUM_RECENT_PERIODS,
        ),
        otpHashService: new SecretHashService(
          this.envString(AppEnv.BARKBANK_OTP_SECRET),
        ),
      };
      this.promisedOtpService = Promise.resolve(new OtpService(config));
      console.log("Created OtpService");
    }
    return this.promisedOtpService;
  }

  public getSenderForOtpEmail(): Promise<EmailContact> {
    return Promise.resolve({
      email: this.envString(AppEnv.BARKBANK_OTP_SENDER_EMAIL),
      name: this.envOptionalString(AppEnv.BARKBANK_OTP_SENDER_NAME),
    });
  }

  public getEmailHashService(): Promise<HashService> {
    if (this.promisedPiiHashService === null) {
      this.promisedPiiHashService = Promise.resolve(
        new SecretHashService(this.envString(AppEnv.BARKBANK_PII_SECRET)),
      );
      console.log("Created EmailHashService");
    }
    return this.promisedPiiHashService;
  }

  public getPiiEncryptionService(): Promise<EncryptionService> {
    if (this.promisedPiiEncryptionService === null) {
      this.promisedPiiEncryptionService = Promise.resolve(
        new SecretEncryptionService(this.envString(AppEnv.BARKBANK_PII_SECRET)),
      );
      console.log("Created PiiEncryptionService");
    }
    return this.promisedPiiEncryptionService;
  }

  public getBreedService(): Promise<BreedService> {
    if (this.promisedBreedService === null) {
      this.promisedBreedService = Promise.resolve(new BreedService());
      console.log("Created BreedService");
    }
    return this.promisedBreedService;
  }

  public getDbPool(): Promise<pg.Pool> {
    if (this.promisedDbPool === null) {
      this.promisedDbPool = Promise.resolve(
        new pg.Pool({
          host: this.envString(AppEnv.BARKBANK_DB_HOST),
          port: this.envInteger(AppEnv.BARKBANK_DB_PORT),
          user: this.envString(AppEnv.BARKBANK_DB_USER),
          password: this.envString(AppEnv.BARKBANK_DB_PASSWORD),
          database: this.envString(AppEnv.BARKBANK_DB_NAME),
        }),
      );
      console.log("Created database connection pool");
    }
    return this.promisedDbPool;
  }

  public getAdminActorFactory(): Promise<AdminActorFactory> {
    if (this.promisedAdminActorFactory === null) {
      this.promisedAdminActorFactory = new Promise(async (resolve) => {
        const [dbPool, emailHashService, piiEncryptionService, adminMapper] =
          await Promise.all([
            this.getDbPool(),
            this.getEmailHashService(),
            this.getPiiEncryptionService(),
            this.getAdminMapper(),
          ]);
        const rootAdminEmail = this.envString(AppEnv.BARKBANK_ROOT_ADMIN_EMAIL);
        if (!isValidEmail(rootAdminEmail)) {
          throw new Error("BARKBANK_ROOT_ADMIN_EMAIL is not a valid email");
        }
        const factory = new AdminActorFactory({
          dbPool,
          emailHashService,
          piiEncryptionService,
          adminMapper,
          rootAdminEmail,
        });
        console.log("Created AdminActorFactory");
        resolve(factory);
      });
    }
    return this.promisedAdminActorFactory;
  }

  public getAdminMapper(): Promise<AdminMapper> {
    if (this.promisedAdminMapper === null) {
      this.promisedAdminMapper = new Promise(async (resolve) => {
        const [emailHashService, piiEncryptionService] = await Promise.all([
          this.getEmailHashService(),
          this.getPiiEncryptionService(),
        ]);
        const mapper = new AdminMapper({
          emailHashService,
          piiEncryptionService,
        });
        console.log("Created AdminMapper");
        resolve(mapper);
      });
    }
    return this.promisedAdminMapper;
  }

  public getVetActorFactory(): Promise<VetActorFactory> {
    if (this.promisedVetActorFactory === null) {
      this.promisedVetActorFactory = new Promise(async (resolve) => {
        const [dbPool, piiEncryptionService] = await Promise.all([
          this.getDbPool(),
          this.getPiiEncryptionService(),
        ]);
        const factory = new VetActorFactory({
          dbPool,
          piiEncryptionService,
        });
        console.log("Created VetActorFactory");
        resolve(factory);
      });
    }
    return this.promisedVetActorFactory;
  }

  public getUserActorFactory(): Promise<UserActorFactory> {
    if (this.promisedUserActorFactory === null) {
      this.promisedUserActorFactory = new Promise(async (resolve) => {
        const service = await this.getUserAccountService();
        const factory = new UserActorFactory(service);
        console.log("Created UserActorFactory");
        resolve(factory);
      });
    }
    return this.promisedUserActorFactory;
  }

  public getUserAccountService(): Promise<UserAccountService> {
    if (this.promisedUserAccountService === null) {
      this.promisedUserAccountService = new Promise(async (resolve) => {
        const [dbPool, emailHashService, userMapper] = await Promise.all([
          this.getDbPool(),
          this.getEmailHashService(),
          this.getUserMapper(),
        ]);
        const service = new UserAccountService({
          dbPool,
          emailHashService,
          userMapper,
        });
        console.log("Created UserAccountService");
        resolve(service);
      });
    }
    return this.promisedUserAccountService;
  }

  public getUserMapper(): Promise<UserMapper> {
    if (this.promisedUserMapper === null) {
      this.promisedUserMapper = new Promise(async (resolve) => {
        const [emailHashService, piiEncryptionService] = await Promise.all([
          this.getEmailHashService(),
          this.getPiiEncryptionService(),
        ]);
        const mapper = new UserMapper({
          emailHashService,
          piiEncryptionService,
        });
        console.log("Created UserMapper");
        resolve(mapper);
      });
    }
    return this.promisedUserMapper;
  }
}

const APP: AppFactory = new AppFactory(process.env);
export default APP;
