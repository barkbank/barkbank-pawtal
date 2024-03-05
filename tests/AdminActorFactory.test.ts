import { AdminActorFactory } from "@/lib/admin/admin-actor-factory";
import { withDb } from "./_db_helpers";
import {
  adminPii,
  insertAdmin,
  getAdminActorFactoryConfig,
  someEmail,
  adminSpec,
  getAdminPersonalData,
} from "./_fixtures";
import { AdminPii } from "@/lib/admin/admin-pii";
import { AdminPersonalData, AdminSpec } from "@/lib/data/db-models";
import { dbInsertAdmin } from "@/lib/data/db-admins";

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
          getAdminActorFactoryConfig(db, { rootAdminEmail: rootAdminEmail }),
        );

        // THEN an admin account should be created for the email; AND the
        // account should have permissions to manage admin accounts; AND no
        // other permissions should be granted; AND the admin name should be
        // “Root”; AND the admin phone number should be empty string.
        const actor = await factory.getAdminActor(rootAdminEmail);
        expect(actor).not.toBeNull();
        expect(await actor?.canManageAdminAccounts()).toBe(true);
        expect(await actor?.canManageVetAccounts()).toBe(false);
        expect(await actor?.canManageUserAccounts()).toBe(false);
        expect(await actor?.canManageDonors()).toBe(false);
        const pii = await actor?.getOwnPii();
        expect(pii?.adminEmail).toEqual(rootAdminEmail);
        expect(pii?.adminName).toEqual("Root");
        expect(pii?.adminPhoneNumber).toEqual("");
      });
    });
    it("should grant permission manage admin accounts to existing root admin account", async () => {
      await withDb(async (db) => {
        // Given BARKBANK_ROOT_ADMIN_EMAIL is a valid email; AND an existing
        // admin account exists for the email; AND the account does not have
        // permissions to manage admin accounts; BUT the account has permissions
        // to manage donors, user accounts, and vet accounts; AND the admin name
        // is “Adam”; AND the admin phone number is “87651234”;
        const rootAdminEmail = someEmail(123);
        const existingPii: AdminPii = {
          adminEmail: rootAdminEmail,
          adminName: "Adam",
          adminPhoneNumber: "87651234",
        };
        const personalData: AdminPersonalData =
          await getAdminPersonalData(existingPii);
        const spec: AdminSpec = {
          ...personalData,
          adminCanManageAdminAccounts: false,
          adminCanManageDonors: true,
          adminCanManageUserAccounts: true,
          adminCanManageVetAccounts: true,
        };
        const adminGen = await dbInsertAdmin(db, spec);

        // WHEN called with the existing root email;
        const factory = new AdminActorFactory(
          getAdminActorFactoryConfig(db, { rootAdminEmail: rootAdminEmail }),
        );

        // THEN the admin account should be granted permissions to manage admin
        // accounts; AND the admin account shall continue to be granted
        // permissions to manage donors, user accounts, and vet accounts; AND
        // the admin name should still be “Adam”; AND the admin phone number
        // should still be “87651234”.
        const actor = await factory.getAdminActor(rootAdminEmail);
        expect(actor).not.toBeNull();
        expect(actor?.getAdminId()).toEqual(adminGen.adminId);
        expect(await actor?.canManageAdminAccounts()).toBe(true);
        expect(await actor?.canManageVetAccounts()).toBe(true);
        expect(await actor?.canManageUserAccounts()).toBe(true);
        expect(await actor?.canManageDonors()).toBe(true);
        const pii = await actor?.getOwnPii();
        expect(pii?.adminEmail).toEqual(rootAdminEmail);
        expect(pii?.adminName).toEqual(existingPii.adminName);
        expect(pii?.adminPhoneNumber).toEqual(existingPii.adminPhoneNumber);
      });
    });
  });
});
