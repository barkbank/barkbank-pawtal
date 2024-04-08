import {
  AdminActorFactory,
  AdminActorFactoryConfig,
} from "./admin/admin-actor-factory";
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
import { OtpConfig, OtpService, OtpServiceImpl } from "./services/otp";
import pg from "pg";
import { VetActorFactory } from "./vet/vet-actor-factory";
import {
  UserActorFactory,
  UserActorFactoryConfig,
} from "./user/user-actor-factory";
import { AppEnv } from "./app-env";
import { isValidEmail } from "./utilities/bark-utils";
import { UserMapper } from "./data/user-mapper";
import { AdminMapper } from "./data/admin-mapper";
import { DogMapper } from "./data/dog-mapper";
import { RegistrationService } from "./services/registration";
import { UserActorConfig } from "./user/user-actor";
import { AdminActorConfig } from "./admin/admin-actor";

export class AppFactory {
  private envs: NodeJS.Dict<string>;
  private promisedEmailService: Promise<EmailSender> | null = null;
  private promisedOtpService: Promise<OtpService> | null = null;
  private promisedPiiHashService: Promise<HashService> | null = null;
  private promisedPiiEncryptionService: Promise<EncryptionService> | null =
    null;
  private promisedOiiEncryptionService: Promise<EncryptionService> | null =
    null;
  private promisedBreedService: Promise<BreedService> | null = null;
  private promisedDbPool: Promise<pg.Pool> | null = null;
  private promisedAdminActorFactory: Promise<AdminActorFactory> | null = null;
  private promisedAdminMapper: Promise<AdminMapper> | null = null;
  private promisedVetActorFactory: Promise<VetActorFactory> | null = null;
  private promisedUserActorFactory: Promise<UserActorFactory> | null = null;
  private promisedUserMapper: Promise<UserMapper> | null = null;
  private promisedDogMapper: Promise<DogMapper> | null = null;
  private promisedRegistrationService: Promise<RegistrationService> | null =
    null;

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

  public getEmailService(): Promise<EmailSender> {
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
      this.promisedOtpService = Promise.resolve(new OtpServiceImpl(config));
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

  private getPiiEncryptionService(): Promise<EncryptionService> {
    if (this.promisedPiiEncryptionService === null) {
      this.promisedPiiEncryptionService = Promise.resolve(
        new SecretEncryptionService(this.envString(AppEnv.BARKBANK_PII_SECRET)),
      );
      console.log("Created PiiEncryptionService");
    }
    return this.promisedPiiEncryptionService;
  }

  private getOiiEncryptionService(): Promise<EncryptionService> {
    if (this.promisedOiiEncryptionService === null) {
      this.promisedOiiEncryptionService = Promise.resolve(
        new SecretEncryptionService(this.envString(AppEnv.BARKBANK_OII_SECRET)),
      );
      console.log("Created OiiEncryptionService");
    }
    return this.promisedOiiEncryptionService;
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
        const [dbPool, emailHashService, adminMapper, dogMapper, userMapper] =
          await Promise.all([
            this.getDbPool(),
            this.getEmailHashService(),
            this.getAdminMapper(),
            this.getDogMapper(),
            this.getUserMapper(),
          ]);
        const rootAdminEmail = this.envString(AppEnv.BARKBANK_ROOT_ADMIN_EMAIL);
        if (!isValidEmail(rootAdminEmail)) {
          throw new Error("BARKBANK_ROOT_ADMIN_EMAIL is not a valid email");
        }
        const factoryConfig: AdminActorFactoryConfig = {
          dbPool,
          emailHashService,
          adminMapper,
          rootAdminEmail,
        };
        const actorConfig: AdminActorConfig = {
          dbPool,
          emailHashService,
          adminMapper,
          userMapper,
          dogMapper,
        };
        const factory = new AdminActorFactory(factoryConfig, actorConfig);
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
        const [dbPool, emailHashService, userMapper, dogMapper] =
          await Promise.all([
            this.getDbPool(),
            this.getEmailHashService(),
            this.getUserMapper(),
            this.getDogMapper(),
          ]);
        const factoryConfig: UserActorFactoryConfig = {
          dbPool,
          emailHashService,
        };
        const actorConfig: UserActorConfig = { dbPool, userMapper, dogMapper };
        const factory = new UserActorFactory(factoryConfig, actorConfig);
        console.log("Created UserActorFactory");
        resolve(factory);
      });
    }
    return this.promisedUserActorFactory;
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

  public getDogMapper(): Promise<DogMapper> {
    if (this.promisedDogMapper === null) {
      this.promisedDogMapper = new Promise(async (resolve) => {
        const oiiEncryptionService = await this.getOiiEncryptionService();
        const mapper = new DogMapper({
          oiiEncryptionService,
        });
        console.log("Created DogMapper");
        resolve(mapper);
      });
    }
    return this.promisedDogMapper;
  }

  public getRegistrationService(): Promise<RegistrationService> {
    if (this.promisedRegistrationService === null) {
      this.promisedRegistrationService = new Promise(async (resolve) => {
        const [dbPool, otpService, emailHashService, userMapper, dogMapper] =
          await Promise.all([
            this.getDbPool(),
            this.getOtpService(),
            this.getEmailHashService(),
            this.getUserMapper(),
            this.getDogMapper(),
          ]);
        const handler = new RegistrationService({
          dbPool,
          otpService,
          emailHashService,
          userMapper,
          dogMapper,
        });
        console.log("Created RegistrationHandler");
        resolve(handler);
      });
    }
    return this.promisedRegistrationService;
  }
}

const APP: AppFactory = new AppFactory(process.env);
export default APP;
