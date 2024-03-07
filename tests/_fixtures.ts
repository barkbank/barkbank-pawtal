import { AdminActorConfig } from "@/lib/admin/admin-actor";
import { encryptAdminPii, AdminPii } from "@/lib/admin/admin-pii";
import { dbInsertAdmin, dbSelectAdmin } from "@/lib/data/db-admins";
import {
  Admin,
  AdminPermissions,
  AdminPersonalData,
  AdminSpec,
  User,
  UserSpec,
  Vet,
  VetSpec,
} from "@/lib/data/db-models";
import { Pool } from "pg";
import { HarnessHashService, HarnessEncryptionService } from "./_harness";
import { AdminActorFactoryConfig } from "@/lib/admin/admin-actor-factory";
import { dbInsertUser, dbSelectUser } from "@/lib/data/db-users";
import { encryptUserPii, UserPii } from "@/lib/user/user-models";
import { VetActorFactoryConfig } from "@/lib/vet/vet-actor-factory";
import { dbInsertVet, dbSelectVet } from "@/lib/data/db-vets";
import { UserAccountService } from "@/lib/user/user-account-service";
import { HashService } from "@/lib/services/hash";
import { EncryptionService } from "@/lib/services/encryption";

export function getEmailHashService(): HashService {
  return new HarnessHashService();
}

export function getPiiEncryptionService(): EncryptionService {
  return new HarnessEncryptionService();
}

export function getAdminActorFactoryConfig(
  db: Pool,
  overrides?: Partial<AdminActorFactoryConfig>,
): AdminActorFactoryConfig {
  const base: AdminActorFactoryConfig = {
    dbPool: db,
    emailHashService: getEmailHashService(),
    piiEncryptionService: getPiiEncryptionService(),
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
): Promise<Admin> {
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
  const personalData = await adminPersonalData(idx);
  const permissions = adminPermissions(idx);
  return { ...personalData, ...permissions, ...overrides };
}

export async function getHashedEmail(email: string): Promise<string> {
  return getEmailHashService().getHashHex(email);
}

export async function getAdminPersonalData(
  adminPii: AdminPii,
): Promise<AdminPersonalData> {
  const adminEncryptedPii = await encryptAdminPii(
    adminPii,
    getPiiEncryptionService(),
  );
  const adminHashedEmail = await getEmailHashService().getHashHex(
    adminPii.adminEmail,
  );
  return { adminHashedEmail, adminEncryptedPii };
}

export async function adminPersonalData(
  idx: number,
): Promise<AdminPersonalData> {
  return getAdminPersonalData(adminPii(idx));
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

export async function getUserAccountService(
  dbPool: Pool,
): Promise<UserAccountService> {
  return new UserAccountService({
    dbPool,
    piiEncryptionService: getPiiEncryptionService(),
    emailHashService: getEmailHashService(),
  });
}

export async function insertUser(idx: number, db: Pool): Promise<User> {
  const spec = await userSpec(idx);
  const gen = await dbInsertUser(db, spec);
  const user = await dbSelectUser(db, gen.userId);
  if (user === null) {
    throw new Error("Failed to retrieve user");
  }
  return user;
}

export async function userSpec(idx: number): Promise<UserSpec> {
  const pii = userPii(idx);
  const userEncryptedPii = await encryptUserPii(pii, getPiiEncryptionService());
  const userHashedEmail = await getEmailHashService().getHashHex(pii.userEmail);
  return { userHashedEmail, userEncryptedPii };
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
  const spec = vetSpec(idx);
  const gen = await dbInsertVet(dbPool, spec);
  const vet = await dbSelectVet(dbPool, gen.vetId);
  if (!vet) {
    throw new Error("Failed to retrieve vet");
  }
  return vet;
}

export function vetSpec(idx: number): VetSpec {
  return {
    vetName: `Vet ${idx}`,
    vetEmail: `vet${idx}@vet.com`,
    vetPhoneNumber: `+65 ${6000000 + idx}`,
    vetAddress: `${100 + idx} Dog Park Drive`,
  };
}

export function someEmail(idx: number): string {
  return `some${idx}@some.com`;
}
