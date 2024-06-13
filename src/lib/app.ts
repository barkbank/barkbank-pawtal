import {
  AdminActorFactory,
  AdminActorFactoryConfig,
} from "./admin/admin-actor-factory";
import { BreedService } from "./services/breed";
import {
  EmailContact,
  EmailService,
  NodemailerEmailService,
  PassthroughEmailService,
  SmtpConfig,
} from "./services/email";
import {
  EncryptionService,
  SecretEncryptionService,
} from "./services/encryption";
import { HashService, SecretHashService } from "./services/hash";
import {
  DevelopmentOtpService,
  OtpConfig,
  OtpService,
  OtpServiceImpl,
} from "./services/otp";
import pg from "pg";
import {
  VetActorFactory,
  VetActorFactoryConfig,
} from "./vet/vet-actor-factory";
import {
  UserActorFactory,
  UserActorFactoryConfig,
} from "./user/user-actor-factory";
import { APP_ENV, AppEnv, AppEnvSchema } from "./app-env";
import { isValidEmail } from "./utilities/bark-utils";
import { UserMapper } from "./data/user-mapper";
import { AdminMapper } from "./data/admin-mapper";
import { DogMapper } from "./data/dog-mapper";
import { RegistrationService } from "./services/registration";
import { UserActorConfig } from "./user/user-actor";
import { AdminActorConfig } from "./admin/admin-actor";
import {
  EmailOtpService,
  EmailOtpServiceConfig,
} from "./services/email-otp-service";
import { VetActorConfig } from "./vet/vet-actor";
import { BarkContext } from "./bark/bark-context";
import { NODE_ENV, NodeEnv } from "./node-envs";

export class AppFactory {
  private envs: NodeJS.Dict<string>;
  private promisedEmailService: Promise<EmailService> | null = null;
  private promisedOtpService: Promise<OtpService> | null = null;
  private promisedPiiHashService: Promise<HashService> | null = null;
  private promisedPiiEncryptionService: Promise<EncryptionService> | null =
    null;
  private promisedOiiEncryptionService: Promise<EncryptionService> | null =
    null;
  private promisedTextEncryptionService: Promise<EncryptionService> | null =
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
  private promisedEmailOtpService: Promise<EmailOtpService> | null = null;
  private promisedBarkContext: Promise<BarkContext> | null = null;

  constructor(envs: NodeJS.Dict<string>) {
    this.envs = envs;
  }

  private envOptionalString(key: AppEnv): string | undefined {
    return this.envs[AppEnvSchema.parse(key)];
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

  public getNodeEnv(): NodeEnv {
    const val = this.envOptionalString(APP_ENV.NODE_ENV);
    if (val === NODE_ENV.PRODUCTION || val === NODE_ENV.TEST) {
      return val;
    }
    return NODE_ENV.DEVELOPMENT;
  }

  public getEmailService(): Promise<EmailService> {
    if (this.promisedEmailService === null) {
      this.promisedEmailService = new Promise<EmailService>((resolve) => {
        if (this.envString(APP_ENV.BARKBANK_SMTP_HOST) === "") {
          resolve(new PassthroughEmailService());
          console.log("Created PassthroughEmailService as EmailService");
          return;
        }

        const config: SmtpConfig = {
          smtpHost: this.envString(APP_ENV.BARKBANK_SMTP_HOST),
          smtpPort: this.envInteger(APP_ENV.BARKBANK_SMTP_PORT),
          smtpUser: this.envString(APP_ENV.BARKBANK_SMTP_USER),
          smtpPassword: this.envString(APP_ENV.BARKBANK_SMTP_PASSWORD),
        };
        resolve(new NodemailerEmailService(config));
        console.log("Created NodemailerEmailService as EmailService");
        return;
      });
    }
    return this.promisedEmailService;
  }

  public getOtpService(): Promise<OtpService> {
    if (this.promisedOtpService === null) {
      if (this.getNodeEnv() === NODE_ENV.DEVELOPMENT) {
        this.promisedOtpService = new Promise<OtpService>((resolve) => {
          const service = new DevelopmentOtpService();
          console.log("Created DevelopmentOtpService as OtpService");
          resolve(service);
        });
      } else {
        this.promisedOtpService = new Promise<OtpService>((resolve) => {
          const config: OtpConfig = {
            otpLength: 6,
            otpPeriodMillis: this.envInteger(
              APP_ENV.BARKBANK_OTP_PERIOD_MILLIS,
            ),
            otpRecentPeriods: this.envInteger(
              APP_ENV.BARKBANK_OTP_NUM_RECENT_PERIODS,
            ),
            otpHashService: new SecretHashService(
              this.envString(APP_ENV.BARKBANK_OTP_SECRET),
            ),
          };
          const service = new OtpServiceImpl(config);
          console.log("Created OtpServiceImpl as OtpService");
          resolve(service);
        });
      }
    }
    return this.promisedOtpService;
  }

  public getSenderForOtpEmail(): Promise<EmailContact> {
    return Promise.resolve({
      email: this.envString(APP_ENV.BARKBANK_OTP_SENDER_EMAIL),
      name: this.envOptionalString(APP_ENV.BARKBANK_OTP_SENDER_NAME),
    });
  }

  public getEmailOtpService(): Promise<EmailOtpService> {
    if (this.promisedEmailOtpService === null) {
      this.promisedEmailOtpService = new Promise<EmailOtpService>(
        async (resolve) => {
          const [
            otpService,
            emailService,
            sender,
            userActorFactory,
            vetActorFactory,
            adminActorFactory,
          ] = await Promise.all([
            this.getOtpService(),
            this.getEmailService(),
            this.getSenderForOtpEmail(),
            this.getUserActorFactory(),
            this.getVetActorFactory(),
            this.getAdminActorFactory(),
          ]);
          const config: EmailOtpServiceConfig = {
            otpService,
            emailService,
            sender,
            userActorFactory,
            vetActorFactory,
            adminActorFactory,
          };
          const service = new EmailOtpService(config);
          resolve(service);
          console.log("Created EmailOtpService");
        },
      );
    }
    return this.promisedEmailOtpService;
  }

  public getEmailHashService(): Promise<HashService> {
    if (this.promisedPiiHashService === null) {
      this.promisedPiiHashService = Promise.resolve(
        new SecretHashService(this.envString(APP_ENV.BARKBANK_PII_SECRET)),
      );
      console.log("Created EmailHashService");
    }
    return this.promisedPiiHashService;
  }

  private getPiiEncryptionService(): Promise<EncryptionService> {
    if (this.promisedPiiEncryptionService === null) {
      this.promisedPiiEncryptionService = Promise.resolve(
        new SecretEncryptionService(
          this.envString(APP_ENV.BARKBANK_PII_SECRET),
        ),
      );
      console.log("Created EncryptionService for PII");
    }
    return this.promisedPiiEncryptionService;
  }

  private getOiiEncryptionService(): Promise<EncryptionService> {
    if (this.promisedOiiEncryptionService === null) {
      this.promisedOiiEncryptionService = Promise.resolve(
        new SecretEncryptionService(
          this.envString(APP_ENV.BARKBANK_OII_SECRET),
        ),
      );
      console.log("Created EncryptionService for OII");
    }
    return this.promisedOiiEncryptionService;
  }

  private getTextEncryptionService(): Promise<EncryptionService> {
    if (this.promisedTextEncryptionService === null) {
      this.promisedTextEncryptionService = Promise.resolve(
        new SecretEncryptionService(
          this.envString(APP_ENV.BARKBANK_TEXT_SECRET),
        ),
      );
      console.log("Created EncryptionService for text");
    }
    return this.promisedTextEncryptionService;
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
      const ssl = this.getNodeEnv() !== NODE_ENV.DEVELOPMENT ? true : undefined;
      this.promisedDbPool = Promise.resolve(
        new pg.Pool({
          host: this.envString(APP_ENV.BARKBANK_DB_HOST),
          port: this.envInteger(APP_ENV.BARKBANK_DB_PORT),
          user: this.envString(APP_ENV.BARKBANK_DB_USER),
          password: this.envString(APP_ENV.BARKBANK_DB_PASSWORD),
          database: this.envString(APP_ENV.BARKBANK_DB_NAME),
          ssl,
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
        const rootAdminEmail = this.envString(
          APP_ENV.BARKBANK_ROOT_ADMIN_EMAIL,
        );
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
        const [dbPool, userMapper, dogMapper, textEncryptionService] =
          await Promise.all([
            this.getDbPool(),
            this.getUserMapper(),
            this.getDogMapper(),
            this.getTextEncryptionService(),
          ]);
        const factoryConfig: VetActorFactoryConfig = { dbPool };
        const actorConfig: VetActorConfig = {
          dbPool,
          userMapper,
          dogMapper,
          textEncryptionService,
        };
        const factory = new VetActorFactory({ factoryConfig, actorConfig });
        console.log("Created VetActorFactory");
        resolve(factory);
      });
    }
    return this.promisedVetActorFactory;
  }

  public getUserActorFactory(): Promise<UserActorFactory> {
    if (this.promisedUserActorFactory === null) {
      this.promisedUserActorFactory = new Promise(async (resolve) => {
        const [
          dbPool,
          emailHashService,
          userMapper,
          dogMapper,
          textEncryptionService,
        ] = await Promise.all([
          this.getDbPool(),
          this.getEmailHashService(),
          this.getUserMapper(),
          this.getDogMapper(),
          this.getTextEncryptionService(),
        ]);
        const factoryConfig: UserActorFactoryConfig = {
          dbPool,
          emailHashService,
        };
        const actorConfig: UserActorConfig = {
          dbPool,
          userMapper,
          dogMapper,
          textEncryptionService,
        };
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

  public getBarkContext(): Promise<BarkContext> {
    if (this.promisedBarkContext === null) {
      this.promisedBarkContext = new Promise(async (resolve) => {
        const [
          dbPool,
          emailHashService,
          piiEncryptionService,
          oiiEncryptionService,
          textEncryptionService,
        ] = await Promise.all([
          this.getDbPool(),
          this.getEmailHashService(),
          this.getPiiEncryptionService(),
          this.getOiiEncryptionService(),
          this.getTextEncryptionService(),
        ]);
        const context: BarkContext = {
          dbPool,
          emailHashService,
          piiEncryptionService,
          oiiEncryptionService,
          textEncryptionService,
        };
        console.log("Created BarkContext");
        resolve(context);
      });
    }
    return this.promisedBarkContext;
  }
}

const APP: AppFactory = new AppFactory(process.env);
export default APP;
