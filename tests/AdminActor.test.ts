import { withDb } from "./_db_helpers";
import { AdminActor } from "@/lib/admin/admin-actor";
import { createAdmin, getAdminActorConfig, adminPii } from "./_fixtures";

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
