import { AdminActorConfig } from "@/lib/admin/admin-actor";
import { encryptAdminPii, AdminPii } from "@/lib/admin/admin-pii";
import { dbInsertAdmin, dbSelectAdmin } from "@/lib/data/dbAdmins";
import { Admin, AdminSpec } from "@/lib/data/models";
import { Pool } from "pg";
import { HarnessHashService, HarnessEncryptionService } from "./_harness";
import { AdminActorFactoryConfig } from "@/lib/admin/admin-actor-factory";

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
