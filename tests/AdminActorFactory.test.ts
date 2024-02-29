import { AdminActorFactory } from "@/lib/admin/admin-actor-factory";
import { withDb } from "./_db_helpers";
import { adminPii, createAdmin, getAdminActorFactoryConfig } from "./_fixtures";

describe("AdminActorFactory", () => {
  describe("getAdminActor", () => {
    it("should load the AdminActor for the corresponding email", async () => {
      await withDb(async (db) => {
        const admin = await createAdmin(1, db);
        const factory = new AdminActorFactory(getAdminActorFactoryConfig(db));
        const pii = adminPii(1);
        const actor = await factory.getAdminActor(pii.adminEmail);
        expect(actor?.getAdminId()).toEqual(admin.adminId);
      });
    });
  });
});
