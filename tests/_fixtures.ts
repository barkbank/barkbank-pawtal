import { AdminActorConfig } from "@/lib/admin/admin-actor";
import { encryptAdminPii, AdminPii } from "@/lib/admin/admin-pii";
import { dbInsertAdmin, dbSelectAdmin } from "@/lib/data/dbAdmins";
import { Admin, AdminSpec, User, UserSpec } from "@/lib/data/models";
import { Pool } from "pg";
import { HarnessHashService, HarnessEncryptionService } from "./_harness";
import { AdminActorFactoryConfig } from "@/lib/admin/admin-actor-factory";
import { dbInsertUser, dbSelectUser } from "@/lib/data/dbUsers";
import { UserActorConfig } from "@/lib/user/user-actor";
import { encryptUserPii, UserPii } from "@/lib/user/user-pii";
import { UserActorFactoryConfig } from "@/lib/user/user-actor-factory";

const emailHashService = new HarnessHashService();
const piiEncryptionService = new HarnessEncryptionService();

export function getAdminActorFactoryConfig(db: Pool): AdminActorFactoryConfig {
  return {
    dbPool: db,
    emailHashService: emailHashService,
    piiEncryptionService: piiEncryptionService,
  };
}

export function getAdminActorConfig(db: Pool): AdminActorConfig {
  return {
    dbPool: db,
    emailHashService: emailHashService,
    piiEncryptionService: piiEncryptionService,
  };
}

export async function createAdmin(idx: number, db: Pool): Promise<Admin> {
  const spec = await adminSpec(1);
  const gen = await dbInsertAdmin(db, spec);
  const admin = await dbSelectAdmin(db, gen.adminId);
  if (admin === null) {
    fail("Failed to retrieve admin");
  }
  return admin;
}

export async function adminSpec(idx: number): Promise<AdminSpec> {
  const pii = adminPii(idx);
  const adminEncryptedPii = await encryptAdminPii(pii, piiEncryptionService);
  const adminHashedEmail = await emailHashService.getHashHex(pii.adminEmail);
  return { adminHashedEmail, adminEncryptedPii };
}

export function adminPii(idx: number): AdminPii {
  return {
    adminEmail: `admin${idx}@admin.com`,
    adminName: `Admin ${idx}`,
    adminPhoneNumber: `+65 ${10000000 + idx}`,
  };
}

export function getUserActorConfig(db: Pool): UserActorConfig {
  return {
    dbPool: db,
    piiEncryptionService: piiEncryptionService,
  };
}

export function getUserActorFactoryConfig(db: Pool): UserActorFactoryConfig {
  return {
    dbPool: db,
    piiEncryptionService,
    emailHashService,
  };
}

export async function createUser(idx: number, db: Pool): Promise<User> {
  const spec = await userSpec(1);
  const gen = await dbInsertUser(db, spec);
  const user = await dbSelectUser(db, gen.userId);
  if (user === null) {
    fail("Failed to retrieve user");
  }
  return user;
}

export async function userSpec(idx: number): Promise<UserSpec> {
  const pii = userPii(idx);
  const userEncryptedPii = await encryptUserPii(pii, piiEncryptionService);
  const userHashedEmail = await emailHashService.getHashHex(pii.userEmail);
  return { userHashedEmail, userEncryptedPii };
}

export function userPii(idx: number): UserPii {
  return {
    userEmail: `user${idx}@user.com`,
    userName: `User ${idx}`,
    userPhoneNumber: `+65 ${10000000 + idx}`,
  };
}
