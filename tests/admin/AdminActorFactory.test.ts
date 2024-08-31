import { AdminActorFactory } from "@/lib/admin/admin-actor-factory";
import { withDb } from "../_db_helpers";
import {
  adminPii,
  insertAdmin,
  getAdminActorFactoryConfig,
  someEmail,
  getAdminSecurePii,
  getAdminAccountService,
} from "../_fixtures";
import { AdminPii } from "@/lib/data/db-models";
import { AdminSecurePii, AdminSpec } from "@/lib/data/db-models";
import { dbInsertAdmin } from "@/lib/data/db-admins";
import { withBarkContext } from "../bark/_context";
import { CODE } from "@/lib/utilities/bark-code";

describe("AdminActorFactory", () => {
  describe("getAdminActor", () => {
    it("should load the AdminActor for the corresponding email", async () => {
      await withDb(async (db) => {
        // Given an existing admin account;
        const admin = await insertAdmin(1, db);
        const pii = adminPii(1);

        // WHEN called with that accounts email;
        const factory = new AdminActorFactory(getAdminActorFactoryConfig(db));
        const actor = await factory.getAdminActor(pii.adminEmail);

        // THEN an admin actor should be returned; AND the actor's admin ID
        // should be that of the existing account;
        expect(actor).not.toBeNull();
        expect(actor?.getAdminId()).toEqual(admin.adminId);
      });
    });
    it("should create root admin account under the right conditions", async () => {
      await withDb(async (db) => {
        // Given BARKBANK_ROOT_ADMIN_EMAIL is a valid email; AND no existing
        // admin account exists for the email;
        const rootAdminEmail = someEmail(1);

        // WHEN called with root admin email;
        const factoryConfig = getAdminActorFactoryConfig(db, {
          rootAdminEmail,
        });
        const factory = new AdminActorFactory(factoryConfig);
        const actor = await factory.getAdminActor(rootAdminEmail);

        // THEN an admin account should be created for the email; AND the
        // account should have permissions to manage admin accounts; AND no
        // other permissions should be granted; AND the admin name should be
        // “Root”; AND the admin phone number should be empty string.
        expect(actor).not.toBeNull();
        const resAccount = await actor!.getOwnAdminAccount();
        const account = resAccount.result!;
        expect(account.adminCanManageAdminAccounts).toBe(true);
        expect(account.adminCanManageVetAccounts).toBe(false);
        expect(account.adminCanManageUserAccounts).toBe(false);
        expect(account.adminCanManageDonors).toBe(false);
        expect(account.adminEmail).toEqual(rootAdminEmail);
        expect(account.adminName).toEqual("Root");
        expect(account.adminPhoneNumber).toEqual("");
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
        // WIP: Use AdminAccountService to create this test account
        const existingPii: AdminPii = {
          adminEmail: rootAdminEmail,
          adminName: "Adam",
          adminPhoneNumber: "87651234",
        };
        const personalData: AdminSecurePii =
          await getAdminSecurePii(existingPii);
        const spec: AdminSpec = {
          ...personalData,
          adminCanManageAdminAccounts: false,
          adminCanManageDonors: true,
          adminCanManageUserAccounts: true,
          adminCanManageVetAccounts: true,
        };
        const adminGen = await dbInsertAdmin(db, spec);

        // WHEN called with the existing root email;
        const factoryConfig = getAdminActorFactoryConfig(db, {
          rootAdminEmail,
        });
        const factory = new AdminActorFactory(factoryConfig);
        const actor = await factory.getAdminActor(rootAdminEmail);

        // THEN an actor should be returned for the existing account; AND the
        // admin account should be granted permissions to manage admin accounts;
        // AND the admin account shall continue to be granted permissions to
        // manage donors, user accounts, and vet accounts; AND the admin name
        // should still be “Adam”; AND the admin phone number should still be
        // “87651234”.
        expect(actor).not.toBeNull();
        const resAccount = await actor!.getOwnAdminAccount();
        const account = resAccount.result!;
        expect(account.adminId).toEqual(adminGen.adminId);
        expect(account.adminCanManageAdminAccounts).toBe(true);
        expect(account.adminCanManageVetAccounts).toBe(true);
        expect(account.adminCanManageUserAccounts).toBe(true);
        expect(account.adminCanManageDonors).toBe(true);
        expect(account.adminEmail).toEqual(rootAdminEmail);
        expect(account.adminName).toEqual(existingPii.adminName);
        expect(account.adminPhoneNumber).toEqual(existingPii.adminPhoneNumber);
      });
    });
    it("should not create root admin account if called with another email", async () => {
      // Or another way to put is that we want the root admin account to be
      // initialised only when the root admin themself logs in.
      await withBarkContext(async ({ context }) => {
        const { dbPool } = context;
        const service = getAdminAccountService(dbPool);

        // Given BARKBANK_ROOT_ADMIN_EMAIL is a valid email; AND no existing
        // admin account exists for the email;
        const rootAdminEmail = someEmail(123);

        // WHEN called with some other email;
        // WIP: Use AdminAccountService to create this test account
        await insertAdmin(1, dbPool);
        const factory = new AdminActorFactory(
          getAdminActorFactoryConfig(dbPool, { rootAdminEmail }),
        );
        await factory.getAdminActor(adminPii(1).adminEmail);

        // THEN no admin account should be created for the configured root admin
        // email.
        const resLookup = await service.getAdminIdByAdminEmail({
          adminEmail: rootAdminEmail,
        });
        expect(resLookup.error).toEqual(CODE.ERROR_ACCOUNT_NOT_FOUND);
      });
    });
  });
});
