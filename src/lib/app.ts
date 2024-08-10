import fs from "fs";
import {
  AdminActorFactory,
  AdminActorFactoryConfig,
} from "./admin/admin-actor-factory";
import {
  EmailContact,
  EmailService,
  NodemailerEmailService,
  PassthroughEmailService,
  SmtpConfig,
} from "./services/email";
import {
  EncryptionService,
  MultiProtocolEncryptionService,
} from "./services/encryption";
import { HashService, SecretHashService } from "./services/hash";
import {
  DevelopmentOtpService,
  OtpConfig,
  OtpService,
  OtpServiceImpl,
} from "./services/otp";
import pg from "pg";
import { VetActorFactory } from "./vet/vet-actor-factory";
import {
  UserActorFactory,
  UserActorFactoryConfig,
} from "./user/user-actor-factory";
import { APP_ENV, AppEnv, AppEnvSchema } from "./app-env";
import { isValidEmail } from "./utilities/bark-utils";
import { UserMapper } from "./data/user-mapper";
import { AdminMapper } from "./data/admin-mapper";
import { DogMapper } from "./data/dog-mapper";
import { RegistrationService } from "./bark/services/registration-service";
import { UserActorConfig } from "./user/user-actor";
import { AdminActorConfig } from "./admin/admin-actor";
import {
  EmailOtpService,
  EmailOtpServiceConfig,
} from "./services/email-otp-service";
import { VetActorConfig } from "./vet/vet-actor";
import { BarkContext } from "./bark/bark-context";
import {
  HkdfEncryptionProtocol,
  HkdfInputKeyMaterial,
} from "./encryption/hkdf-encryption-protocol";
import { EncryptionProtocol } from "./encryption/encryption-protocol";
import { BARKBANK_ENV, BarkBankEnv } from "./barkbank-env";
import { EmailHashService } from "./services/email-hash-service";
import { TrackerService } from "./bark/services/tracker-service";
import { GlobalRef } from "./utilities/global-ref";
import { randomUUID } from "crypto";
import { opLogPawtalEvent } from "./bark/operations/op-log-pawtal-event";
import { PAWTAL_EVENT_TYPE } from "./bark/enums/pawtal-event-type";
import { CronService } from "./bark/services/cron-service";

export class AppFactory {
  private envs: NodeJS.Dict<string>;
  private instanceId: string;
  private promisedEmailService: Promise<EmailService> | null = null;
  private promisedOtpService: Promise<OtpService> | null = null;
  private promisedEmailHashservice: Promise<HashService> | null = null;
  private promisedPiiEncryptionService: Promise<EncryptionService> | null =
    null;
  private promisedOiiEncryptionService: Promise<EncryptionService> | null =
    null;
  private promisedTextEncryptionService: Promise<EncryptionService> | null =
    null;
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
  private promisedTrackerService: Promise<TrackerService> | null = null;
  private promisedCronService: Promise<CronService> | null = null;

  constructor(envs: NodeJS.Dict<string>) {
    this.envs = envs;
    this.instanceId = randomUUID();
    this.logCreated("AppFactory");
  }

  private logCreated(obj: string) {
    const eventTs = new Date();
    const instanceId = this.instanceId;
    opLogPawtalEvent({
      eventType: PAWTAL_EVENT_TYPE.APP_CREATED,
      params: { eventTs, instanceId, obj },
    });
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

  public getBarkBankEnv(): BarkBankEnv {
    const val = this.envOptionalString(APP_ENV.BARKBANK_ENV);
    if (val === BARKBANK_ENV.DEVELOPMENT || val === BARKBANK_ENV.TEST) {
      return val;
    }
    return BARKBANK_ENV.PRODUCTION;
  }

  public getInstanceId(): string {
    return this.instanceId;
  }

  public getCronService(): Promise<CronService> {
    if (this.promisedCronService === null) {
      this.promisedCronService = new Promise(async (resolve) => {
        const context = await this.getBarkContext();
        const instanceId = this.getInstanceId();
        const service = new CronService({ context, instanceId });
        this.logCreated("CronService");
        resolve(service);
      });
    }
    return this.promisedCronService;
  }

  public getTrackerService(): Promise<TrackerService> {
    if (this.promisedTrackerService === null) {
      this.promisedTrackerService = new Promise(async (resolve) => {
        const context = await this.getBarkContext();
        const service = new TrackerService(context);
        this.logCreated("TrackerService");
        resolve(service);
      });
    }
    return this.promisedTrackerService;
  }

  public getEmailService(): Promise<EmailService> {
    if (this.promisedEmailService === null) {
      this.promisedEmailService = new Promise<EmailService>((resolve) => {
        if (this.envString(APP_ENV.BARKBANK_SMTP_HOST) === "") {
          resolve(new PassthroughEmailService());
          this.logCreated("PassthroughEmailService(EmailService)");
          return;
        }

        const config: SmtpConfig = {
          smtpHost: this.envString(APP_ENV.BARKBANK_SMTP_HOST),
          smtpPort: this.envInteger(APP_ENV.BARKBANK_SMTP_PORT),
          smtpUser: this.envString(APP_ENV.BARKBANK_SMTP_USER),
          smtpPassword: this.envString(APP_ENV.BARKBANK_SMTP_PASSWORD),
        };
        resolve(new NodemailerEmailService(config));
        this.logCreated("NodemailerEmailService(EmailService)");
        return;
      });
    }
    return this.promisedEmailService;
  }

  public getOtpService(): Promise<OtpService> {
    if (this.promisedOtpService === null) {
      if (
        this.getBarkBankEnv() === BARKBANK_ENV.DEVELOPMENT ||
        this.getBarkBankEnv() === BARKBANK_ENV.TEST
      ) {
        this.promisedOtpService = new Promise<OtpService>((resolve) => {
          const service = new DevelopmentOtpService();
          this.logCreated("DevelopmentOtpService(OtpService)");
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
          this.logCreated("OtpServiceImpl(OtpService)");
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
          this.logCreated("EmailOtpService");
        },
      );
    }
    return this.promisedEmailOtpService;
  }

  public getEmailHashService(): Promise<HashService> {
    if (this.promisedEmailHashservice === null) {
      const secret = this.envString(APP_ENV.BARKBANK_EMAIL_SECRET);
      const secretHashService = new SecretHashService(secret);
      const emailHashService = new EmailHashService(secretHashService);
      this.promisedEmailHashservice = Promise.resolve(emailHashService);
      this.logCreated("EmailHashService");
    }
    return this.promisedEmailHashservice;
  }

  private getHkdfInputKeyMaterialList(): HkdfInputKeyMaterial[] {
    return [
      {
        ikmId: "IKM1",
        ikmHex: this.envString(APP_ENV.BARKBANK_IKM1_HEX),
      },
      {
        ikmId: "IKM2",
        ikmHex: this.envString(APP_ENV.BARKBANK_IKM2_HEX),
      },
    ];
  }

  private newHkdfEncryptionProtocol(args: {
    purpose: string;
  }): EncryptionProtocol {
    const { purpose } = args;
    const ikms = this.getHkdfInputKeyMaterialList();
    return new HkdfEncryptionProtocol({ ikms, purpose });
  }

  private getPiiEncryptionService(): Promise<EncryptionService> {
    if (this.promisedPiiEncryptionService === null) {
      this.promisedPiiEncryptionService = Promise.resolve(
        new MultiProtocolEncryptionService([
          this.newHkdfEncryptionProtocol({ purpose: "pii" }),
        ]),
      );
      this.logCreated("PiiEncryptionService");
    }
    return this.promisedPiiEncryptionService;
  }

  private getOiiEncryptionService(): Promise<EncryptionService> {
    if (this.promisedOiiEncryptionService === null) {
      this.promisedOiiEncryptionService = Promise.resolve(
        new MultiProtocolEncryptionService([
          this.newHkdfEncryptionProtocol({ purpose: "oii" }),
        ]),
      );
      this.logCreated("OiiEncryptionService");
    }
    return this.promisedOiiEncryptionService;
  }

  private getTextEncryptionService(): Promise<EncryptionService> {
    if (this.promisedTextEncryptionService === null) {
      this.promisedTextEncryptionService = Promise.resolve(
        new MultiProtocolEncryptionService([
          this.newHkdfEncryptionProtocol({ purpose: "text" }),
        ]),
      );
      this.logCreated("TextEncryptionService");
    }
    return this.promisedTextEncryptionService;
  }

  public getDbPool(): Promise<pg.Pool> {
    if (this.promisedDbPool === null) {
      this.promisedDbPool = new Promise(async (resolve) => {
        const ssl = (() => {
          const fileName = this.envOptionalString(
            APP_ENV.BARKBANK_DB_CA_CERT_FILE,
          );
          if (fileName === undefined) {
            if (this.getBarkBankEnv() === BARKBANK_ENV.PRODUCTION) {
              throw Error(
                "BARKBANK_DB_CA_CERT_FILE must be specified in production",
              );
            }
            return undefined;
          }
          // See this reference for how to specify a self-signed CA cert when
          // connecting to the database.
          // https://node-postgres.com/features/ssl#self-signed-cert
          const ca = fs
            .readFileSync(`src/resources/certs/${fileName}`)
            .toString();
          console.log({ ca });
          return { rejectUnauthorized: false, ca };
        })();
        const dbPool = new pg.Pool({
          host: this.envString(APP_ENV.BARKBANK_DB_HOST),
          port: this.envInteger(APP_ENV.BARKBANK_DB_PORT),
          user: this.envString(APP_ENV.BARKBANK_DB_USER),
          password: this.envString(APP_ENV.BARKBANK_DB_PASSWORD),
          database: this.envString(APP_ENV.BARKBANK_DB_NAME),
          ssl,
        });
        this.logCreated("DbPool");
        resolve(dbPool);
      });
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
        this.logCreated("AdminActorFactory");
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
        this.logCreated("AdminMapper");
        resolve(mapper);
      });
    }
    return this.promisedAdminMapper;
  }

  public getVetActorFactory(): Promise<VetActorFactory> {
    if (this.promisedVetActorFactory === null) {
      this.promisedVetActorFactory = new Promise(async (resolve) => {
        const [context, dbPool, userMapper, dogMapper, textEncryptionService] =
          await Promise.all([
            this.getBarkContext(),
            this.getDbPool(),
            this.getUserMapper(),
            this.getDogMapper(),
            this.getTextEncryptionService(),
          ]);
        const actorConfig: VetActorConfig = {
          dbPool,
          userMapper,
          dogMapper,
          textEncryptionService,
        };
        const factory = new VetActorFactory(context, { actorConfig });
        this.logCreated("VetActorFactory");
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
        this.logCreated("UserActorFactory");
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
        this.logCreated("UserMapper");
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
        this.logCreated("DogMapper");
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
        this.logCreated("RegistrationHandler");
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
          emailService,
        ] = await Promise.all([
          this.getDbPool(),
          this.getEmailHashService(),
          this.getPiiEncryptionService(),
          this.getOiiEncryptionService(),
          this.getTextEncryptionService(),
          this.getEmailService(),
        ]);
        const context: BarkContext = {
          dbPool,
          emailHashService,
          piiEncryptionService,
          oiiEncryptionService,
          textEncryptionService,
          emailService,
        };
        this.logCreated("BarkContext");
        resolve(context);
      });
    }
    return this.promisedBarkContext;
  }
}

const appSingleton = new GlobalRef<AppFactory>("pawtal.app");
if (!appSingleton.value) {
  appSingleton.value = new AppFactory(process.env);
  appSingleton.value.getCronService().then((service) => {
    service.start();
  });
  console.log({
    BARKBANK_ENV: appSingleton.value.getBarkBankEnv(),
    NODE_ENV: process.env.NODE_ENV,
  });
}
const APP: AppFactory = appSingleton.value;
export default APP;
