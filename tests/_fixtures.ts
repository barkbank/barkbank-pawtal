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
  DogAntigenPresence,
} from "@/lib/bark/enums/dog-antigen-presence";
import { YES_NO_UNKNOWN, YesNoUnknown } from "@/lib/bark/enums/yes-no-unknown";
import { DOG_GENDER, DogGender } from "@/lib/bark/enums/dog-gender";
import { USER_RESIDENCY } from "@/lib/bark/enums/user-residency";
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
import { VetActorFactory } from "@/lib/vet/vet-actor-factory";
import { dbInsertVet, dbSelectVet } from "@/lib/data/db-vets";
import { HashService } from "@/lib/services/hash";
import { EncryptionService } from "@/lib/services/encryption";
import { AdminMapper } from "@/lib/data/admin-mapper";
import { VetMapper } from "@/lib/data/vet-mapper";
import { DogMapper } from "@/lib/data/dog-mapper";
import { UserMapper } from "@/lib/data/user-mapper";
import {
  SINGAPORE_TIME_ZONE,
  parseCommonDate,
} from "@/lib/utilities/bark-time";
import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { dbInsertDog } from "@/lib/data/db-dogs";
import { OtpService } from "@/lib/services/otp";
import { UserActor, UserActorConfig } from "@/lib/user/user-actor";
import { UserActorFactory } from "@/lib/user/user-actor-factory";
import { REPORTED_INELIGIBILITY } from "@/lib/bark/enums/reported-ineligibility";
import { POS_NEG_NIL } from "@/lib/bark/enums/pos-neg-nil";
import { CallOutcome } from "@/lib/bark/enums/call-outcome";
import { dbInsertReportAndUpdateCall } from "@/lib/data/db-reports";
import { dbInsertCall } from "@/lib/data/db-calls";
import { EmailService } from "@/lib/services/email";
import {
  EmailOtpService,
  EmailOtpServiceConfig,
} from "@/lib/services/email-otp-service";
import { VetActor, VetActorConfig } from "@/lib/vet/vet-actor";
import { MILLIS_PER_WEEK } from "@/lib/utilities/bark-millis";
import {
  DogProfileSpec,
  DogProfileSpecSchema,
  SubProfileSpecSchema,
} from "@/lib/bark/models/dog-profile-models";
import { SubProfileSpec } from "@/lib/bark/models/dog-profile-models";
import { sprintf } from "sprintf-js";
import { toSubProfile } from "@/lib/bark/mappers/to-sub-profile";
import { BarkContext } from "@/lib/bark/bark-context";
import { EmailHashService } from "@/lib/services/email-hash-service";
import { UserAccountService } from "@/lib/bark/services/user-account-service";
import { RegistrationService } from "@/lib/bark/services/registration-service";
import { VetAccountService } from "@/lib/bark/services/vet-account-service";
import { VetClinicDao } from "@/lib/bark/daos/vet-clinic-dao";
import { AdminAccountService } from "@/lib/bark/services/admin-account-service";
import { dateAgo } from "./_time_helpers";
import { DogProfileService } from "@/lib/bark/services/dog-profile-service";
import {
  UserAccountSpec,
  UserAccountSpecSchema,
} from "@/lib/bark/models/user-models";
import { USER_TITLE } from "@/lib/bark/enums/user-title";
import {
  VetClinicSpec,
  VetClinicSpecSchema,
} from "@/lib/bark/models/vet-models";
import {
  EncryptedBarkReportData,
  EncryptedBarkReportDataSchema,
} from "@/lib/bark/models/encrypted-bark-report-data";
import { ReportDao } from "@/lib/bark/daos/report-dao";

export function ensureTimePassed(): void {
  const t0 = new Date().getTime();
  let t1 = new Date().getTime();
  while (t0 === t1) {
    t1 = new Date().getTime();
  }
}

export function getEmailHashService(): HashService {
  const harness = new HarnessHashService();
  return new EmailHashService(harness);
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

export function getRegistrationService(dbPool: Pool) {
  const otpService = getOtpService();
  const dogMapper = getDogMapper();
  const userAccountService = getUserAccountService(dbPool);
  const context = getBarkContext(dbPool);
  return new RegistrationService({
    dbPool,
    otpService,
    dogMapper,
    userAccountService,
    context,
  });
}

export function getUserAccountService(dbPool: Pool) {
  const context = getBarkContext(dbPool);
  return new UserAccountService(context);
}

export function getDogProfileService(dbPool: Pool) {
  const context = getBarkContext(dbPool);
  const reportDao = new ReportDao();
  return new DogProfileService({ context, reportDao });
}

export function mockUserAccountSpec(
  overrides?: Partial<UserAccountSpec>,
): UserAccountSpec {
  const base: UserAccountSpec = {
    userEmail: `mock.user@mock.com`,
    userName: `Mok Yu Ser`,
    userPhoneNumber: `1800 130 133`,
    userResidency: USER_RESIDENCY.SINGAPORE,
    userTitle: USER_TITLE.PREFER_NOT_TO_SAY,
  };
  const out = { ...base, ...overrides };
  return UserAccountSpecSchema.parse(out);
}

export async function givenUserActor(args: {
  idx: number;
  context: BarkContext;
}) {
  const { idx, context } = args;
  const { dbPool } = context;
  const userAccountService = getUserAccountService(dbPool);
  const spec = mockUserAccountSpec({
    userEmail: `user.${idx}@given.com`,
  });
  const resCreate = await userAccountService.create({ spec });
  if (resCreate.error !== undefined) {
    throw new Error(resCreate.error);
  }
  const { userId } = resCreate.result;
  return getUserActor(dbPool, userId);
}

export function getUserActor(dbPool: Pool, userId: string): UserActor {
  const config = getUserActorConfig(dbPool);
  const context = getBarkContext(dbPool);
  return new UserActor({ userId, config });
}

export function getUserActorConfig(dbPool: Pool): UserActorConfig {
  return {
    dbPool,
    userMapper: getUserMapper(),
    dogMapper: getDogMapper(),
    textEncryptionService: getTextEncryptionService(),
    context: getBarkContext(dbPool),
    userAccountService: getUserAccountService(dbPool),
    dogProfileService: getDogProfileService(dbPool),
  };
}

export function getUserActorFactory(dbPool: Pool) {
  const actorConfig = getUserActorConfig(dbPool);
  const context = getBarkContext(dbPool);
  const userAccountService = new UserAccountService(context);
  return new UserActorFactory({ actorConfig, userAccountService });
}

export function getAdminAccountService(dbPool: Pool) {
  const context = getBarkContext(dbPool);
  return new AdminAccountService({ context });
}

export function getAdminActorFactoryConfig(
  db: Pool,
  overrides?: Partial<AdminActorFactoryConfig>,
): AdminActorFactoryConfig {
  const base: AdminActorFactoryConfig = {
    rootAdminEmail: getRootAdminEmail(),
    adminAccountService: getAdminAccountService(db),
    adminActorConfig: getAdminActorConfig(db),
  };
  return { ...base, ...overrides };
}

export function getVetAccountService(dbPool: Pool) {
  const context = getBarkContext(dbPool);
  return new VetAccountService({ context });
}

export function getRootAdminEmail() {
  return "";
}

export function getAdminActorConfig(dbPool: Pool): AdminActorConfig {
  return {
    adminAccountService: getAdminAccountService(dbPool),
    vetAccountService: getVetAccountService(dbPool),
    userAccountService: getUserAccountService(dbPool),
    registrationService: getRegistrationService(dbPool),
    rootAdminEmail: getRootAdminEmail(),
  };
}

export function getAdminActorFactory(dbPool: Pool) {
  const config = getAdminActorFactoryConfig(dbPool);
  return new AdminActorFactory(config);
}

export function getAdminActor(dbPool: Pool, adminId: string): AdminActor {
  const config = getAdminActorConfig(dbPool);
  return new AdminActor({ adminId, config });
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

export function getBarkContext(dbPool: Pool): BarkContext {
  return {
    dbPool,
    emailHashService: getEmailHashService(),
    piiEncryptionService: getPiiEncryptionService(),
    oiiEncryptionService: getOiiEncryptionService(),
    textEncryptionService: getTextEncryptionService(),
    emailService: getEmailService(),
  };
}

export function getVetActorConfig(dbPool: Pool): VetActorConfig {
  return {
    dbPool,
    userMapper: getUserMapper(),
    dogMapper: getDogMapper(),
    textEncryptionService: getTextEncryptionService(),
    context: getBarkContext(dbPool),
    vetAccountService: getVetAccountService(dbPool),
  };
}

export function getVetActorFactory(dbPool: Pool): VetActorFactory {
  const context = getBarkContext(dbPool);
  const actorConfig = getVetActorConfig(dbPool);
  const vetAccountService = getVetAccountService(dbPool);
  return new VetActorFactory({ context, vetAccountService, actorConfig });
}

export async function getVetActor(
  vetId: string,
  dbPool: Pool,
): Promise<VetActor> {
  const dao = new VetClinicDao(dbPool);
  const clinic = await dao.getByVetId({ vetId });
  const { vetEmail } = clinic!;
  const factory = getVetActorFactory(dbPool);
  const actor = await factory.getVetActor(vetEmail);
  return actor!;
}

export function mockVetClinicSpec(
  overrides?: Partial<VetClinicSpec>,
): VetClinicSpec {
  const base: VetClinicSpec = {
    vetEmail: "vet.clinic@mock.com",
    vetName: "Mock Vet Name",
    vetAddress: "123 Mock Street, Mock Town, Mockington",
    vetPhoneNumber: "1612 0808",
  };
  const out = { ...base, ...overrides };
  return VetClinicSpecSchema.parse(out);
}

export async function givenVetActor(args: {
  idx: number;
  context: BarkContext;
}): Promise<VetActor> {
  const { idx, context } = args;
  const { dbPool } = context;
  const vetAccountService = getVetAccountService(dbPool);
  const spec = mockVetClinicSpec({
    vetEmail: `given.vet.${idx}@given.com`,
    vetName: `Given Vet ${idx}`,
  });
  const resCreate = await vetAccountService.createVetClinic({ spec });
  if (resCreate.error !== undefined) {
    throw new Error(
      `Failed to create mock vet account from spec: ${JSON.stringify(spec)}`,
    );
  }
  const factory = getVetActorFactory(dbPool);
  const actor = await factory.getVetActor(spec.vetEmail);
  if (actor === null) {
    throw new Error(`Failed to get mock vet by email ${spec.vetEmail}`);
  }
  return actor;
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
  const ymd = sprintf("%04d-%02d-%02d", y, m, d);
  return parseCommonDate(ymd, SINGAPORE_TIME_ZONE);
}

export function getEligibleDogSpecOverrides(): Partial<DogSpec> {
  return {
    dogBreed: "Great Elidog",
    dogBirthday: new Date(Date.now() - 3 * 52 * MILLIS_PER_WEEK), // ~3 yrs old
    dogGender: DOG_GENDER.FEMALE,
    dogWeightKg: 25,
    dogEverPregnant: YES_NO_UNKNOWN.NO,
    dogEverReceivedTransfusion: YES_NO_UNKNOWN.NO,
  };
}

// TODO: Update insertDog to use mockDogProfileSpec. Difficulty is that getDogSpec is used in get-dog-profile.test.ts as expected value.
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

export function mockDogProfileSpec(
  overrides?: Partial<DogProfileSpec>,
): DogProfileSpec {
  const base: DogProfileSpec = {
    dogName: "Woofgang",
    dogBirthday: dateAgo({ numYears: 3 }),
    dogBreed: "German Guard Dog",
    dogGender: DOG_GENDER.MALE,
    dogWeightKg: 26.5,
    dogDea1Point1: DOG_ANTIGEN_PRESENCE.UNKNOWN,
    dogEverPregnant: YES_NO_UNKNOWN.NO,
    dogEverReceivedTransfusion: YES_NO_UNKNOWN.NO,
    dogPreferredVetId: "",
  };
  const out = { ...base, ...overrides };
  return DogProfileSpecSchema.parse(out);
}

export function mockSubProfileSpec(
  overrides?: Partial<SubProfileSpec>,
): SubProfileSpec {
  const base: SubProfileSpec = {
    dogName: "Woofgang",
    dogWeightKg: 26.5,
    dogEverPregnant: YES_NO_UNKNOWN.NO,
    dogEverReceivedTransfusion: YES_NO_UNKNOWN.NO,
    dogPreferredVetId: "",
  };
  const out = { ...base, ...overrides };
  return SubProfileSpecSchema.parse(out);
}

export function mockEncryptedBarkReportData(
  overrides?: Partial<EncryptedBarkReportData>,
): EncryptedBarkReportData {
  const base: EncryptedBarkReportData = {
    visitTime: parseCommonDate("8 Mar 2022", SINGAPORE_TIME_ZONE),
    dogWeightKg: 26.5,
    dogBodyConditioningScore: 5,
    dogHeartworm: POS_NEG_NIL.NEGATIVE,
    dogDea1Point1: POS_NEG_NIL.NEGATIVE,
    ineligibilityStatus: REPORTED_INELIGIBILITY.NIL,
    encryptedIneligibilityReason: "",
    ineligibilityExpiryTime: null,
    dogDidDonateBlood: true,
  };
  const out = { ...base, ...overrides };
  return EncryptedBarkReportDataSchema.parse(out);
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
  const gen = await dbInsertReportAndUpdateCall(dbPool, spec);
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
    dogDidDonateBlood: false,
    dogHeartworm: POS_NEG_NIL.NIL,
    dogDea1Point1: POS_NEG_NIL.NIL,
    dogReportedIneligibility: REPORTED_INELIGIBILITY.NIL,
    encryptedIneligibilityReason: "",
    ineligibilityExpiryTime: null,
  };
  return { ...base, ...overrides };
}

export async function fetchDogOwnerId(
  dbCtx: DbContext,
  dogId: string,
): Promise<{ userId: string }> {
  const sql = `SELECT user_id as "userId" FROM dogs WHERE dog_id = $1`;
  const res = await dbQuery<{ userId: string }>(dbCtx, sql, [dogId]);
  return res.rows[0];
}

// TODO: Remove this when no longer used.
// - It is used by tests for addMyDog, updateDogProfile, and updateSubProfile
export async function fetchDogInfo(
  dbPool: Pool,
  dogId: string,
): Promise<{
  userId: string;
  dogProfile: DogProfileSpec;
  subProfile: SubProfileSpec;
  profileModificationTime: Date;
}> {
  const { userId } = await fetchDogOwnerId(dbPool, dogId);
  const actor = getUserActor(dbPool, userId);
  const { result } = await actor.getDogProfile({ dogId });
  const dogProfile = DogProfileSpecSchema.parse(result);
  const subProfile = toSubProfile(dogProfile);
  const { profileModificationTime } = await _getProfileModificationTime(
    dbPool,
    dogId,
  );
  return { userId, dogProfile, subProfile, profileModificationTime };
}

async function _getProfileModificationTime(
  dbPool: Pool,
  dogId: string,
): Promise<{ profileModificationTime: Date }> {
  const res = await dbQuery<{ profileModificationTime: Date }>(
    dbPool,
    `
    select profile_modification_time as "profileModificationTime"
    from dogs
    where dog_id = $1
    `,
    [dogId],
  );
  return res.rows[0];
}
