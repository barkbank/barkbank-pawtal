import { dbInsertAdmin, dbSelectAdmin } from "@/lib/data/dbAdmins";
import { withDb } from "./_db_helpers";
import { AdminPii, encryptAdminPii } from "@/lib/admin/admin-pii";
import { Admin, AdminSpec } from "@/lib/data/models";
import { HarnessEncryptionService, HarnessHashService } from "./_harness";
import { AdminActor, AdminActorConfig } from "@/lib/admin/admin-actor";
import { Pool } from "pg";

describe("AdminActor", () => {
  it("can retrieve its own actor data from the database", async () => {
    await withDb(async (db) => {
      const admin = await createAdmin(1, db);
      const config = getAdminActorConfig(db);
      const actor = new AdminActor(admin.adminId, config);
      const ownAdmin = await actor.getOwnAdmin();
      expect(ownAdmin).toEqual(admin);
    });
  });
  it("can retrieve its own PII", async () => {
    await withDb(async (db) => {
      const admin = await createAdmin(1, db);
      const config = getAdminActorConfig(db);
      const actor = new AdminActor(admin.adminId, config);
      const ownPii = await actor.getOwnPii();
      expect(ownPii).toEqual(adminPii(1));
    });
  });
});

const emailHashService = new HarnessHashService();
const piiEncryptionService = new HarnessEncryptionService();

function getAdminActorConfig(db: Pool): AdminActorConfig {
  return {
    dbPool: db,
    emailHashService: emailHashService,
    piiEncryptionService: piiEncryptionService,
  };
}

async function createAdmin(idx: number, db: Pool): Promise<Admin> {
  const spec = await adminSpec(1);
  const gen = await dbInsertAdmin(db, spec);
  const admin = await dbSelectAdmin(db, gen.adminId);
  if (admin === null) {
    fail("Failed to retrieve admin");
  }
  return admin;
}

async function adminSpec(idx: number): Promise<AdminSpec> {
  const pii = adminPii(idx);
  const adminEncryptedPii = await encryptAdminPii(pii, piiEncryptionService);
  const adminHashedEmail = await emailHashService.getHashHex(pii.adminEmail);
  return { adminHashedEmail, adminEncryptedPii };
}

function adminPii(idx: number): AdminPii {
  return {
    adminEmail: `admin${idx}@admin.com`,
    adminName: `Admin ${idx}`,
    adminPhoneNumber: `+65 ${10000000 + idx}`,
  };
}
