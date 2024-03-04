import { AdminActorFactory } from "@/lib/admin/admin-actor-factory";
import { withDb } from "./_db_helpers";
import {
  adminPii,
  insertAdmin,
  getAdminActorFactoryConfig,
  someEmail,
} from "./_fixtures";

describe("AdminActorFactory", () => {
  describe("getAdminActor", () => {
    it("should load the AdminActor for the corresponding email", async () => {
      await withDb(async (db) => {
        const admin = await insertAdmin(1, db);
        const factory = new AdminActorFactory(getAdminActorFactoryConfig(db));
        const pii = adminPii(1);
        const actor = await factory.getAdminActor(pii.adminEmail);
        expect(actor?.getAdminId()).toEqual(admin.adminId);
      });
    });
    it("should create root admin account under the right conditions", async () => {
      await withDb(async (db) => {
        // Given BARKBANK_ROOT_ADMIN_EMAIL is a valid email; AND no existing
        // admin account exists for the email;
        const rootAdminEmail = someEmail(1);

        // WHEN called with root admin email;
        const factory = new AdminActorFactory(
          getAdminActorFactoryConfig(db, { rootAdminEmail: someEmail(1) }),
        );

        // THEN an admin account should be created for the email; AND the
        // account should have permissions to manage admin accounts; AND no
        // other permissions should be granted; AND the admin name should be
        // “Root”; AND the admin phone number should be empty string.
        const actor = await factory.getAdminActor(someEmail(1));
        expect(actor).not.toBeNull();
        expect(await actor?.canManageAdminAccounts()).toBe(true);
        expect(await actor?.canManageVetAccounts()).toBe(false);
        expect(await actor?.canManageUserAccounts()).toBe(false);
        expect(await actor?.canManageDonors()).toBe(false);
        const pii = await actor?.getOwnPii();
        expect(pii?.adminEmail).toEqual(someEmail(1));
        expect(pii?.adminName).toEqual("Root");
        expect(pii?.adminPhoneNumber).toEqual("");
      });
    });
  });
});
