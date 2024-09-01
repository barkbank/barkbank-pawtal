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
import { UserActorFactory } from "./user/user-actor-factory";
import { APP_ENV, AppEnv, AppEnvSchema } from "./app-env";
import { isValidEmail } from "./utilities/bark-utils";
import { UserMapper } from "./data/user-mapper";
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
import {
  CRON_SCHEDULE,
  CronService,
  CronTask,
} from "./bark/services/cron-service";
import { UserAccountService } from "./bark/services/user-account-service";
import { Visitor } from "./bark/actors/visitor";
import { VetAccountService } from "./bark/services/vet-account-service";
import { PawtalEventService } from "./bark/services/pawtal-event-service";
import { opIndexDonorSnapshots } from "./bark/operations/op-index-donor-snapshots";
import { AdminAccountService } from "./bark/services/admin-account-service";

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
  private promisedUserAccountService: Promise<UserAccountService> | null = null;
  private promisedVisitor: Promise<Visitor> | null = null;
  private promisedVetAccountService: Promise<VetAccountService> | null = null;
  private promisedPawtalEventService: Promise<PawtalEventService> | null = null;
  private promisedAdminAccountService: Promise<AdminAccountService> | null =
    null;

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

  getAdminAccountService(): Promise<AdminAccountService> {
    if (this.promisedAdminAccountService === null) {
      this.promisedAdminAccountService = new Promise(async (resolve) => {
        const context = await this.getBarkContext();
        const service = new AdminAccountService({ context });
        this.logCreated("AdminAccountService");
        resolve(service);
      });
    }
    return this.promisedAdminAccountService;
  }

  getGoogleAnalyticsMeasurementId(): string | undefined {
    const measurementId = this.envOptionalString(APP_ENV.GA_MEASUREMENT_ID);
    console.log({ measurementId });
    return measurementId;
  }

  getVetAccountService(): Promise<VetAccountService> {
    if (this.promisedVetAccountService === null) {
      this.promisedVetAccountService = new Promise(async (resolve) => {
        const context = await this.getBarkContext();
        const service = new VetAccountService({ context });
        this.logCreated("VetAccountService");
        resolve(service);
      });
    }
    return this.promisedVetAccountService;
  }

  getPawtalEventService(): Promise<PawtalEventService> {
    if (this.promisedPawtalEventService === null) {
      this.promisedPawtalEventService = new Promise(async (resolve) => {
        const context = await this.getBarkContext();
        const service = new PawtalEventService({ context });
        this.logCreated("PawtalEventService");
        resolve(service);
      });
    }
    return this.promisedPawtalEventService;
  }

  getVisitor(): Promise<Visitor> {
    if (this.promisedVisitor === null) {
      this.promisedVisitor = new Promise(async (resolve) => {
        const context = await this.getBarkContext();
        const registrationService = await this.getRegistrationService();
        const userAccountService = await this.getUserAccountService();
        const pawtalEventService = await this.getPawtalEventService();
        const visitor = new Visitor({
          context,
          registrationService,
          userAccountService,
          pawtalEventService,
        });
        this.logCreated("Visitor");
        resolve(visitor);
      });
    }
    return this.promisedVisitor;
  }

  public getCronService(): Promise<CronService> {
    if (this.promisedCronService === null) {
      this.promisedCronService = new Promise(async (resolve) => {
        const instanceId = this.getInstanceId();
        const pawtalEventService = await this.getPawtalEventService();
        const tasks: CronTask[] = await Promise.all([
          this._newIndexDonorSnapshotsTask(),
        ]);
        const service = new CronService({
          tasks,
          instanceId,
          pawtalEventService,
        });
        this.logCreated("CronService");
        resolve(service);
      });
    }
    return this.promisedCronService;
  }

  private async _newIndexDonorSnapshotsTask(): Promise<CronTask> {
    const context = await this.getBarkContext();
    const task: CronTask = {
      taskName: "index_donor_snapshots",
      taskSchedule: CRON_SCHEDULE.EVERYDAY_AT_0200_SGT,
      runTask: async () => {
        const referenceDate = new Date();
        const { result, error } = await opIndexDonorSnapshots(context, {
          referenceDate,
        });
        if (error !== undefined) {
          return { error };
        }
        return result;
      },
    };
    return task;
  }

  public getTrackerService(): Promise<TrackerService> {
    if (this.promisedTrackerService === null) {
      this.promisedTrackerService = new Promise(async (resolve) => {
        const pawtalEventService = await this.getPawtalEventService();
        const service = new TrackerService({ pawtalEventService });
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

  getRootAdminEmail(): string {
    return this.envString(APP_ENV.BARKBANK_ROOT_ADMIN_EMAIL);
  }

  public getAdminActorFactory(): Promise<AdminActorFactory> {
    if (this.promisedAdminActorFactory === null) {
      this.promisedAdminActorFactory = new Promise(async (resolve) => {
        const [
          vetAccountService,
          userAccountService,
          registrationService,
          adminAccountService,
        ] = await Promise.all([
          this.getVetAccountService(),
          this.getUserAccountService(),
          this.getRegistrationService(),
          this.getAdminAccountService(),
        ]);
        const rootAdminEmail = this.getRootAdminEmail();
        if (!isValidEmail(rootAdminEmail)) {
          throw new Error("BARKBANK_ROOT_ADMIN_EMAIL is not a valid email");
        }
        const adminActorConfig: AdminActorConfig = {
          adminAccountService,
          vetAccountService,
          userAccountService,
          registrationService,
          rootAdminEmail,
        };
        const factoryConfig: AdminActorFactoryConfig = {
          rootAdminEmail,
          adminAccountService,
          adminActorConfig,
        };
        const factory = new AdminActorFactory(factoryConfig);
        this.logCreated("AdminActorFactory");
        resolve(factory);
      });
    }
    return this.promisedAdminActorFactory;
  }

  public getVetActorFactory(): Promise<VetActorFactory> {
    if (this.promisedVetActorFactory === null) {
      this.promisedVetActorFactory = new Promise(async (resolve) => {
        const [
          context,
          dbPool,
          userMapper,
          dogMapper,
          textEncryptionService,
          vetAccountService,
        ] = await Promise.all([
          this.getBarkContext(),
          this.getDbPool(),
          this.getUserMapper(),
          this.getDogMapper(),
          this.getTextEncryptionService(),
          this.getVetAccountService(),
        ]);
        const actorConfig: VetActorConfig = {
          dbPool,
          userMapper,
          dogMapper,
          textEncryptionService,
          context,
          vetAccountService,
        };
        const factory = new VetActorFactory({
          context,
          vetAccountService,
          actorConfig,
        });
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
          userMapper,
          dogMapper,
          textEncryptionService,
          context,
          userAccountService,
        ] = await Promise.all([
          this.getDbPool(),
          this.getUserMapper(),
          this.getDogMapper(),
          this.getTextEncryptionService(),
          this.getBarkContext(),
          this.getUserAccountService(),
        ]);
        const actorConfig: UserActorConfig = {
          dbPool,
          userMapper,
          dogMapper,
          textEncryptionService,
        };
        const factory = new UserActorFactory({
          actorConfig,
          context,
          userAccountService,
        });
        this.logCreated("UserActorFactory");
        resolve(factory);
      });
    }
    return this.promisedUserActorFactory;
  }

  public getUserAccountService(): Promise<UserAccountService> {
    if (this.promisedUserAccountService === null) {
      this.promisedUserAccountService = new Promise(async (resolve) => {
        const context = await this.getBarkContext();
        const service = new UserAccountService(context);
        this.logCreated("UserAccountService");
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
        const [dbPool, otpService, dogMapper, context, userAccountService] =
          await Promise.all([
            this.getDbPool(),
            this.getOtpService(),
            this.getDogMapper(),
            this.getBarkContext(),
            this.getUserAccountService(),
          ]);
        const handler = new RegistrationService({
          dbPool,
          otpService,
          dogMapper,
          context,
          userAccountService,
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
