import { AdminActorConfig } from "@/lib/admin/admin-actor";
import {
  AdminPermissions,
  AdminPii,
  AdminRecord,
  AdminSecurePii,
  AdminSpec,
  DogAntigenPresence,
  DogDetails,
  DogGen,
  DogGender,
  DogOii,
  DogSecureOii,
  DogSpec,
  UserPii,
  UserRecord,
  USER_RESIDENCY,
  UserSpec,
  Vet,
  VetSpec,
  YesNoUnknown,
} from "@/lib/data/db-models";
import { dbInsertAdmin, dbSelectAdmin } from "@/lib/data/db-admins";
import { Pool } from "pg";
import {
  HarnessHashService,
  HarnessEncryptionService,
  HarnessOtpService,
} from "./_harness";
import { AdminActorFactoryConfig } from "@/lib/admin/admin-actor-factory";
import { dbInsertUser, dbSelectUser } from "@/lib/data/db-users";
import { VetActorFactoryConfig } from "@/lib/vet/vet-actor-factory";
import { dbInsertVet, dbSelectVet } from "@/lib/data/db-vets";
import { HashService } from "@/lib/services/hash";
import { EncryptionService } from "@/lib/services/encryption";
import { AdminMapper } from "@/lib/data/admin-mapper";
import { VetMapper } from "@/lib/data/vet-mapper";
import { DogMapper } from "@/lib/data/dog-mapper";
import { UserMapper } from "@/lib/data/user-mapper";
import { BARK_UTC } from "@/lib/bark-utils";
import { DbContext, dbQuery } from "@/lib/data/db-utils";
import { dbInsertDog } from "@/lib/data/db-dogs";
import { OtpService } from "@/lib/services/otp";
import { UserActorConfig } from "@/lib/user/user-actor";
import { UserActorFactoryConfig } from "@/lib/user/user-actor-factory";
import {
  CALL_OUTCOME,
  CallOutcome,
  POS_NEG_NIL,
  REPORTED_INELIGIBILITY,
} from "@/lib/models/bark-models";

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

export function getGeneralEncryptionService(): EncryptionService {
  // For reasons and notes
  return new HarnessEncryptionService("general");
}

export function getOtpService(): OtpService {
  return new HarnessOtpService();
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

export function getUserActorConfig(dbPool: Pool): UserActorConfig {
  return {
    dbPool,
    userMapper: getUserMapper(),
    dogMapper: getDogMapper(),
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

export function getAdminActorFactoryConfig(
  db: Pool,
  overrides?: Partial<AdminActorFactoryConfig>,
): AdminActorFactoryConfig {
  const base: AdminActorFactoryConfig = {
    dbPool: db,
    emailHashService: getEmailHashService(),
    piiEncryptionService: getPiiEncryptionService(),
    adminMapper: getAdminMapper(),
    rootAdminEmail: "",
  };
  return { ...base, ...overrides };
}

export function getAdminActorConfig(db: Pool): AdminActorConfig {
  return {
    dbPool: db,
    emailHashService: getEmailHashService(),
    piiEncryptionService: getPiiEncryptionService(),
  };
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

export async function insertUser(idx: number, db: Pool): Promise<UserRecord> {
  const spec = await getUserSpec(idx);
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
): Promise<DogGen> {
  const spec = await getDogSpec(idx);
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
  const presenceList: DogAntigenPresence[] = Object.values(DogAntigenPresence);
  return presenceList[idx % presenceList.length];
}

function getDogGender(idx: number): DogGender {
  const genderList: DogGender[] = Object.values(DogGender);
  return genderList[idx % genderList.length];
}

function getDogWeightKg(idx: number): number | null {
  const options: (number | null)[] = [null, 6, 12, 17, 22, 26, 31, 38];
  return options[idx % options.length];
}

function getYesNoUnknown(idx: number): YesNoUnknown {
  const responseList: YesNoUnknown[] = Object.values(YesNoUnknown);
  return responseList[idx % responseList.length];
}

function getDogEverPregnant(idx: number): YesNoUnknown {
  const gender = getDogGender(idx);
  if (gender === DogGender.MALE) {
    return YesNoUnknown.NO;
  }
  if (gender === DogGender.UNKNOWN) {
    return YesNoUnknown.UNKNOWN;
  }
  return getYesNoUnknown(idx);
}

export async function insertCall(
  dbPool: Pool,
  dogId: string,
  vetId: string,
  callOutcome: CallOutcome,
  optOutReason?: string,
): Promise<{ callId: string }> {
  const encryptedReason =
    optOutReason === undefined
      ? ""
      : await getGeneralEncryptionService().getEncryptedData(optOutReason);
  const res1 = await dbQuery(
    dbPool,
    `
    insert into calls (
      dog_id,
      vet_id,
      call_outcome,
      encrypted_opt_out_reason
    )
    values ($1, $2, $3, $4)
    returning call_id
    `,
    [dogId, vetId, callOutcome, encryptedReason],
  );
  const callId = res1.rows[0].call_id;
  return { callId };
}

export async function insertReport(
  dbPool: Pool,
  callId: string,
): Promise<{ reportId: string }> {
  const currentTs = new Date().getTime();
  const visitTs = currentTs - 24 * 60 * 60 * 1000;
  const visitTime = new Date(visitTs);
  const dogWeightKg = 25;
  const dogBodyConditioningScore = 5;
  const dogHeartworm = POS_NEG_NIL.NIL;
  const dogDea1Point1 = POS_NEG_NIL.NIL;
  const dogReportedIneligibility = REPORTED_INELIGIBILITY.NIL;
  const encryptedIneligibilityReason = "";
  const ineligibilityExpiryTime = null;
  const res1 = await dbQuery(
    dbPool,
    `
    insert into reports (
      call_id,
      dog_id,
      vet_id,
      visit_time,
      dog_weight_kg,
      dog_body_conditioning_score,
      dog_heartworm,
      dog_dea1_point1,
      dog_reported_ineligibility,
      encrypted_ineligibility_reason,
      ineligibility_expiry_time
    )
    values (
      $1,
      (SELECT dog_id FROM calls WHERE call_id = $1),
      (SELECT vet_id FROM calls WHERE call_id = $1),
      $2, $3, $4, $5, $6, $7, $8, $9
    )
    returning report_id
    `,
    [
      callId,
      visitTime,
      dogWeightKg,
      dogBodyConditioningScore,
      dogHeartworm,
      dogDea1Point1,
      dogReportedIneligibility,
      encryptedIneligibilityReason,
      ineligibilityExpiryTime,
    ],
  );
  const reportId: string = res1.rows[0].report_id;
  return {
    reportId,
  };
}
