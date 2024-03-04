import { withDb } from "./_db_helpers";
import { AdminActor } from "@/lib/admin/admin-actor";
import { insertAdmin, getAdminActorConfig, adminPii } from "./_fixtures";

describe("AdminActor", () => {
  it("can retrieve its own actor data from the database", async () => {
    await withDb(async (db) => {
      const admin = await insertAdmin(1, db);
      const config = getAdminActorConfig(db);
      const actor = new AdminActor(admin.adminId, config);
      const ownAdmin = await actor.getOwnAdmin();
      expect(ownAdmin).toEqual(admin);
    });
  });
  it("caches own admin", async () => {
    await withDb(async (db) => {
      const admin = await insertAdmin(1, db);
      const config = getAdminActorConfig(db);
      const actor = new AdminActor(admin.adminId, config);
      const promise1 = actor.getOwnAdmin();
      const promise2 = actor.getOwnAdmin();
      const promises = await Promise.all([promise1, promise2]);
      expect(promises[0]).toBe(promises[1]);
    });
  });
  it("can retrieve its own PII", async () => {
    await withDb(async (db) => {
      const admin = await insertAdmin(2, db);
      const config = getAdminActorConfig(db);
      const actor = new AdminActor(admin.adminId, config);
      const ownPii = await actor.getOwnPii();
      expect(ownPii).toEqual(adminPii(2));
    });
  });
  it("cannot manage admin accounts without required permissions", async () => {
    await withDb(async (db) => {
      const admin = await insertAdmin(1, db, {
        adminCanManageAdminAccounts: false,
      });
      const config = getAdminActorConfig(db);
      const actor = new AdminActor(admin.adminId, config);
      expect(await actor.canManageAdminAccounts()).toBe(false);
    });
  });
  it("cannot manage vet accounts without required permissions", async () => {
    await withDb(async (db) => {
      const admin = await insertAdmin(1, db, {
        adminCanManageVetAccounts: false,
      });
      const config = getAdminActorConfig(db);
      const actor = new AdminActor(admin.adminId, config);
      expect(await actor.canManageVetAccounts()).toBe(false);
    });
  });
  it("cannot manage user accounts without required permissions", async () => {
    await withDb(async (db) => {
      const admin = await insertAdmin(1, db, {
        adminCanManageUserAccounts: false,
      });
      const config = getAdminActorConfig(db);
      const actor = new AdminActor(admin.adminId, config);
      expect(await actor.canManageUserAccounts()).toBe(false);
    });
  });
  it("cannot manage donors without required permissions", async () => {
    await withDb(async (db) => {
      const admin = await insertAdmin(1, db, {
        adminCanManageDonors: false,
      });
      const config = getAdminActorConfig(db);
      const actor = new AdminActor(admin.adminId, config);
      expect(await actor.canManageDonors()).toBe(false);
    });
  });
  it("can manage admin accounts with required permissions", async () => {
    await withDb(async (db) => {
      const admin = await insertAdmin(1, db, {
        adminCanManageAdminAccounts: true,
      });
      const config = getAdminActorConfig(db);
      const actor = new AdminActor(admin.adminId, config);
      expect(await actor.canManageAdminAccounts()).toBe(true);
    });
  });
  it("can manage vet accounts with required permissions", async () => {
    await withDb(async (db) => {
      const admin = await insertAdmin(1, db, {
        adminCanManageVetAccounts: true,
      });
      const config = getAdminActorConfig(db);
      const actor = new AdminActor(admin.adminId, config);
      expect(await actor.canManageVetAccounts()).toBe(true);
    });
  });
  it("can manage user accounts with required permissions", async () => {
    await withDb(async (db) => {
      const admin = await insertAdmin(1, db, {
        adminCanManageUserAccounts: true,
      });
      const config = getAdminActorConfig(db);
      const actor = new AdminActor(admin.adminId, config);
      expect(await actor.canManageUserAccounts()).toBe(true);
    });
  });
  it("can manage donors with required permissions", async () => {
    await withDb(async (db) => {
      const admin = await insertAdmin(1, db, {
        adminCanManageDonors: true,
      });
      const config = getAdminActorConfig(db);
      const actor = new AdminActor(admin.adminId, config);
      expect(await actor.canManageDonors()).toBe(true);
    });
  });
});
