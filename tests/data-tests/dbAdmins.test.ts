import {
  dbInsertAdmin,
  dbSelectAdmin,
  dbSelectAdminIdByAdminHashedEmail,
} from "@/lib/data/dbAdmins";
import { withDb } from "../_db_helpers";
import { adminSpec } from "./_dbFixtures";
import { guaranteed } from "@/lib/bark-utils";
import { toAdminSpec } from "@/lib/data/mappers";

describe("dbAdmins", () => {
  describe("dbInsertAdmin", () => {
    it("should insert an admin", async () => {
      await withDb(async (db) => {
        const adminGen = await dbInsertAdmin(db, adminSpec(1));
        expect(adminGen.adminCreationTime).toBeTruthy();
        expect(adminGen.adminModificationTime).toBeTruthy();
        expect(adminGen.adminModificationTime).toEqual(
          adminGen.adminCreationTime,
        );
      });
    });
  });
  describe("dbSelectAdmin", () => {
    it("should return admin matching the adminId", async () => {
      await withDb(async (db) => {
        const adminGen = await dbInsertAdmin(db, adminSpec(1));
        const admin = await dbSelectAdmin(db, adminGen.adminId);
        expect(admin).not.toBeNull();
        expect(admin?.adminCreationTime).toBeTruthy();
        expect(admin?.adminModificationTime).toBeTruthy();
        expect(admin?.adminModificationTime).toEqual(admin?.adminCreationTime);
        const spec = toAdminSpec(guaranteed(admin));
        expect(spec).toMatchObject(adminSpec(1));
      });
    });
    it("should return null when no admin matches the adminId", async () => {
      await withDb(async (db) => {
        const admin = await dbSelectAdmin(db, "111");
        expect(admin).toBeNull();
      });
    });
  });
  describe("dbSelectAdminIdByAdminHashedEmail", () => {
    it("should return adminId matching the hashed email", async () => {
      await withDb(async (db) => {
        const adminGen = await dbInsertAdmin(db, adminSpec(1));
        const adminId = await dbSelectAdminIdByAdminHashedEmail(
          db,
          adminSpec(1).adminHashedEmail,
        );
        expect(adminId).toEqual(adminGen.adminId);
      });
    });
    it("should return null when no admin matches the hashed email", async () => {
      await withDb(async (db) => {
        const adminId = await dbSelectAdminIdByAdminHashedEmail(
          db,
          "not_found",
        );
        expect(adminId).toBeNull();
      });
    });
  });
});
