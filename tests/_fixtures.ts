import { AdminActor, AdminActorConfig } from "@/lib/admin/admin-actor";
import {
  AdminPermissions,
  AdminPii,
  AdminRecord,
  AdminSecurePii,
  AdminSpec,
  DogDetails,
  DogGen,
  DogOii,
  DogSecureOii,
  DogSpec,
  UserPii,
  UserRecord,
  UserSpec,
  Vet,
  VetSpec,
  DbReportSpec,
  DbReportGen,
  DbCallSpec,
  DbCallGen,
} from "@/lib/data/db-models";
import {
  DOG_ANTIGEN_PRESENCE,
  DOG_GENDER,
  DogAntigenPresence,
  DogGender,
  YES_NO_UNKNOWN,
  YesNoUnknown,
} from "@/lib/data/db-enums";
import { USER_RESIDENCY } from "@/lib/data/db-enums";
import { dbInsertAdmin, dbSelectAdmin } from "@/lib/data/db-admins";
import { Pool } from "pg";
import {
  HarnessHashService,
  HarnessEncryptionService,
  HarnessOtpService,
  HarnessEmailService,
} from "./_harness";
import {
  AdminActorFactory,
  AdminActorFactoryConfig,
} from "@/lib/admin/admin-actor-factory";
import { dbInsertUser, dbSelectUser } from "@/lib/data/db-users";
import {
  VetActorFactory,
  VetActorFactoryConfig,
} from "@/lib/vet/vet-actor-factory";
import { dbInsertVet, dbSelectVet } from "@/lib/data/db-vets";
import { HashService } from "@/lib/services/hash";
import { EncryptionService } from "@/lib/services/encryption";
import { AdminMapper } from "@/lib/data/admin-mapper";
import { VetMapper } from "@/lib/data/vet-mapper";
import { DogMapper } from "@/lib/data/dog-mapper";
import { UserMapper } from "@/lib/data/user-mapper";
import { BARK_UTC } from "@/lib/utilities/bark-time";
import { DbContext } from "@/lib/data/db-utils";
import { dbInsertDog } from "@/lib/data/db-dogs";
import { OtpService } from "@/lib/services/otp";
import { UserActor, UserActorConfig } from "@/lib/user/user-actor";
import {
  UserActorFactory,
  UserActorFactoryConfig,
} from "@/lib/user/user-actor-factory";
import {
  CallOutcome,
  POS_NEG_NIL,
  REPORTED_INELIGIBILITY,
} from "@/lib/data/db-enums";
import { dbInsertReport } from "@/lib/data/db-reports";
import { dbInsertCall } from "@/lib/data/db-calls";
import { EmailService } from "@/lib/services/email";
import {
  EmailOtpService,
  EmailOtpServiceConfig,
} from "@/lib/services/email-otp-service";

export function ensureTimePassed(): void {
  const t0 = new Date().getTime();
  let t1 = new Date().getTime();
  while (t0 === t1) {
    t1 = new Date().getTime();
  }
}

export function getEmailHashService(): HashService {
  return new HarnessHashService();
}

export function getPiiEncryptionService(): EncryptionService {
  return new HarnessEncryptionService("pii-secret");
}

export function getOiiEncryptionService(): EncryptionService {
  return new HarnessEncryptionService("oii-secret");
}

export function getTextEncryptionService(): EncryptionService {
  // For reasons and notes
  return new HarnessEncryptionService("text-secret");
}

export async function getEncryptedText(text: string): Promise<string> {
  return getTextEncryptionService().getEncryptedData(text);
}

export async function getDecryptedText(encryptedText: string): Promise<string> {
  return getTextEncryptionService().getDecryptedData(encryptedText);
}

export function getOtpService(): OtpService {
  return new HarnessOtpService();
}

export function getEmailService(): EmailService {
  return new HarnessEmailService();
}

export function getEmailOtpService(
  dbPool: Pool,
  configOverrides?: Partial<EmailOtpServiceConfig>,
): EmailOtpService {
  const base: EmailOtpServiceConfig = {
    otpService: getOtpService(),
    emailService: getEmailService(),
    sender: {
      email: "otp@test.com",
      name: "OTP Test",
    },
    userActorFactory: getUserActorFactory(dbPool),
    vetActorFactory: getVetActorFactory(dbPool),
    adminActorFactory: getAdminActorFactory(dbPool),
  };
  const config = { ...base, ...configOverrides };
  return new EmailOtpService(config);
}

export function getAdminMapper(): AdminMapper {
  return new AdminMapper({
    emailHashService: getEmailHashService(),
    piiEncryptionService: getPiiEncryptionService(),
  });
}

export function getVetMapper(): VetMapper {
  return new VetMapper();
}

export function getDogMapper(): DogMapper {
  return new DogMapper({
    oiiEncryptionService: getOiiEncryptionService(),
  });
}

export function getUserMapper(): UserMapper {
  return new UserMapper({
    emailHashService: getEmailHashService(),
    piiEncryptionService: getPiiEncryptionService(),
  });
}

export function getUserActor(dbPool: Pool, userId: string): UserActor {
  return new UserActor(userId, getUserActorConfig(dbPool));
}

export function getUserActorConfig(dbPool: Pool): UserActorConfig {
  return {
    dbPool,
    userMapper: getUserMapper(),
    dogMapper: getDogMapper(),
    textEncryptionService: getTextEncryptionService(),
  };
}

export function getUserActorFactoryConfig(
  dbPool: Pool,
): UserActorFactoryConfig {
  return {
    dbPool,
    emailHashService: getEmailHashService(),
  };
}

export function getUserActorFactory(dbPool: Pool) {
  return new UserActorFactory(
    getUserActorFactoryConfig(dbPool),
    getUserActorConfig(dbPool),
  );
}

export function getAdminActorFactoryConfig(
  db: Pool,
  overrides?: Partial<AdminActorFactoryConfig>,
): AdminActorFactoryConfig {
  const base: AdminActorFactoryConfig = {
    dbPool: db,
    emailHashService: getEmailHashService(),
    adminMapper: getAdminMapper(),
    rootAdminEmail: "",
  };
  return { ...base, ...overrides };
}

export function getAdminActorConfig(db: Pool): AdminActorConfig {
  return {
    dbPool: db,
    emailHashService: getEmailHashService(),
    adminMapper: getAdminMapper(),
    userMapper: getUserMapper(),
    dogMapper: getDogMapper(),
  };
}

export function getAdminActorFactory(dbPool: Pool) {
  return new AdminActorFactory(
    getAdminActorFactoryConfig(dbPool),
    getAdminActorConfig(dbPool),
  );
}

export function getAdminActor(dbPool: Pool, adminId: string): AdminActor {
  const config = getAdminActorConfig(dbPool);
  return new AdminActor(adminId, config);
}

export async function insertAdmin(
  idx: number,
  db: Pool,
  specOverrides?: Partial<AdminSpec>,
): Promise<AdminRecord> {
  const specBase = await adminSpec(idx);
  const spec = { ...specBase, ...specOverrides };
  const gen = await dbInsertAdmin(db, spec);
  const admin = await dbSelectAdmin(db, gen.adminId);
  if (admin === null) {
    throw new Error("Failed to retrieve admin");
  }
  return admin;
}

export async function adminSpec(
  idx: number,
  overrides?: Partial<AdminSpec>,
): Promise<AdminSpec> {
  const securePii = await adminSecurePii(idx);
  const permissions = adminPermissions(idx);
  return { ...securePii, ...permissions, ...overrides };
}

export async function getHashedEmail(email: string): Promise<string> {
  return getEmailHashService().getHashHex(email);
}

export async function getAdminSecurePii(
  adminPii: AdminPii,
): Promise<AdminSecurePii> {
  const mapper = getAdminMapper();
  return mapper.mapAdminPiiToAdminSecurePii(adminPii);
}

export async function adminSecurePii(idx: number): Promise<AdminSecurePii> {
  return getAdminSecurePii(adminPii(idx));
}

export function adminPermissions(idx: number): AdminPermissions {
  return {
    adminCanManageAdminAccounts: (idx + 1) % 3 == 0,
    adminCanManageVetAccounts: (idx + 2) % 3 == 0,
    adminCanManageUserAccounts: (idx + 3) % 3 == 0,
    adminCanManageDonors: (idx + 4) % 3 == 0,
  };
}

export function adminPii(idx: number): AdminPii {
  return {
    adminEmail: `admin${idx}@admin.com`,
    adminName: `Admin ${idx}`,
    adminPhoneNumber: `+65 ${10000000 + idx}`,
  };
}

export async function insertUser(
  idx: number,
  db: Pool,
  overrides?: Partial<UserSpec>,
): Promise<UserRecord> {
  const base = await getUserSpec(idx);
  const spec = { ...base, ...overrides };
  const gen = await dbInsertUser(db, spec);
  const user = await dbSelectUser(db, gen.userId);
  if (user === null) {
    throw new Error("Failed to retrieve user");
  }
  return user;
}

export async function getUserSpec(idx: number): Promise<UserSpec> {
  const pii = userPii(idx);
  const mapper = getUserMapper();
  const securePii = await mapper.mapUserPiiToUserSecurePii(pii);
  const userResidency = USER_RESIDENCY.SINGAPORE;
  return { ...securePii, userResidency };
}

export function userPii(idx: number): UserPii {
  return {
    userEmail: `user${idx}@user.com`,
    userName: `User ${idx}`,
    userPhoneNumber: `+65 ${10000000 + idx}`,
  };
}

export function getVetActorFactoryConfig(dbPool: Pool): VetActorFactoryConfig {
  return {
    dbPool,
    piiEncryptionService: getPiiEncryptionService(),
  };
}

export function getVetActorFactory(dbPool: Pool): VetActorFactory {
  return new VetActorFactory(getVetActorFactoryConfig(dbPool));
}

export async function insertVet(idx: number, dbPool: Pool): Promise<Vet> {
  const spec = getVetSpec(idx);
  const gen = await dbInsertVet(dbPool, spec);
  const vet = await dbSelectVet(dbPool, gen.vetId);
  if (!vet) {
    throw new Error("Failed to retrieve vet");
  }
  return vet;
}

export function getVetSpec(idx: number, overrides?: Partial<VetSpec>): VetSpec {
  const base: VetSpec = {
    vetName: `Vet ${idx}`,
    vetEmail: `vet${idx}@vet.com`,
    vetPhoneNumber: `+65 ${6000000 + idx}`,
    vetAddress: `${100 + idx} Dog Park Drive`,
  };
  return { ...base, ...overrides };
}

export function someEmail(idx: number): string {
  return `some${idx}@some.com`;
}

function getDogBirthday(idx: number): Date {
  const y = 2022 - (idx % 5);
  const m = 1 + (idx % 11);
  const d = 1 + (idx % 23);
  return BARK_UTC.getDate(y, m, d);
}

export async function insertDog(
  idx: number,
  userId: string,
  dbCtx: DbContext,
  overrides?: Partial<DogSpec>,
): Promise<DogGen> {
  const base = await getDogSpec(idx);
  const spec = { ...base, ...overrides };
  const gen = await dbInsertDog(dbCtx, userId, spec);
  return gen;
}

export async function getDogSpec(idx: number): Promise<DogSpec> {
  const dogDetails = await getDogDetails(idx);
  const dogSecureOii = await getDogSecureOii(idx);
  return { ...dogDetails, ...dogSecureOii };
}

export async function getDogSecureOii(idx: number): Promise<DogSecureOii> {
  const mapper = getDogMapper();
  const oii = await getDogOii(idx);
  return mapper.mapDogOiiToDogSecureOii(oii);
}

export async function getDogDetails(
  idx: number,
  overrides?: Partial<DogDetails>,
): Promise<DogDetails> {
  const base = {
    dogBreed: getDogBreed(idx),
    dogBirthday: getDogBirthday(idx),
    dogGender: getDogGender(idx),
    dogWeightKg: getDogWeightKg(idx),
    dogDea1Point1: getDogAntigenPresence(idx + 1 + 1),
    dogEverPregnant: getDogEverPregnant(idx),
    dogEverReceivedTransfusion: getYesNoUnknown(idx),
  };
  return { ...base, ...overrides };
}

export async function getDogOii(idx: number): Promise<DogOii> {
  return {
    dogName: `DogName${idx}`,
  };
}

function getDogBreed(idx: number): string {
  return `Breed${idx}`;
}

function getDogAntigenPresence(idx: number): DogAntigenPresence {
  const presenceList: DogAntigenPresence[] =
    Object.values(DOG_ANTIGEN_PRESENCE);
  return presenceList[idx % presenceList.length];
}

function getDogGender(idx: number): DogGender {
  const genderList: DogGender[] = Object.values(DOG_GENDER);
  return genderList[idx % genderList.length];
}

function getDogWeightKg(idx: number): number | null {
  const options: (number | null)[] = [null, 6, 12, 17, 22, 26, 31, 38];
  return options[idx % options.length];
}

function getYesNoUnknown(idx: number): YesNoUnknown {
  const responseList: YesNoUnknown[] = Object.values(YES_NO_UNKNOWN);
  return responseList[idx % responseList.length];
}

function getDogEverPregnant(idx: number): YesNoUnknown {
  const gender = getDogGender(idx);
  if (gender === DOG_GENDER.MALE) {
    return YES_NO_UNKNOWN.NO;
  }
  if (gender === DOG_GENDER.UNKNOWN) {
    return YES_NO_UNKNOWN.UNKNOWN;
  }
  return getYesNoUnknown(idx);
}

export async function insertCall(
  dbPool: Pool,
  dogId: string,
  vetId: string,
  callOutcome: CallOutcome,
  optOutReason?: string,
): Promise<DbCallGen> {
  const encryptedOptOutReason =
    optOutReason === undefined
      ? ""
      : await getTextEncryptionService().getEncryptedData(optOutReason);
  const spec: DbCallSpec = {
    dogId,
    vetId,
    callOutcome,
    encryptedOptOutReason,
  };
  const gen = await dbInsertCall(dbPool, spec);
  return gen;
}

export async function insertReport(
  dbPool: Pool,
  callId: string,
  overrides?: Partial<DbReportSpec>,
): Promise<DbReportGen> {
  const spec = getDbReportSpec(callId, overrides);
  const gen = await dbInsertReport(dbPool, spec);
  return gen;
}

export function getDbReportSpec(
  callId: string,
  overrides?: Partial<DbReportSpec>,
): DbReportSpec {
  const currentTs = new Date().getTime();
  const millisInOneDay = 24 * 60 * 60 * 1000;
  const visitTs = currentTs - millisInOneDay;
  const visitTime = new Date(visitTs);
  const base: DbReportSpec = {
    callId: callId,
    visitTime: visitTime,
    dogWeightKg: 1,
    dogBodyConditioningScore: 1,
    dogHeartworm: POS_NEG_NIL.NIL,
    dogDea1Point1: POS_NEG_NIL.NIL,
    dogReportedIneligibility: REPORTED_INELIGIBILITY.NIL,
    encryptedIneligibilityReason: "",
    ineligibilityExpiryTime: null,
  };
  return { ...base, ...overrides };
}
