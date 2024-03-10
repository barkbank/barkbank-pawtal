import {
  dbInsertAdmin,
  dbSelectAdmin,
  dbSelectAdminIdByAdminHashedEmail,
} from "@/lib/data/db-admins";
import { withDb } from "../_db_helpers";
import { guaranteed } from "@/lib/bark-utils";
import { adminSpec, getAdminMapper } from "../_fixtures";

describe("db-admins", () => {
  describe("dbInsertAdmin", () => {
    it("should insert an admin", async () => {
      await withDb(async (db) => {
        const spec = await adminSpec(1);
        const adminGen = await dbInsertAdmin(db, spec);
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
        const specIn = await adminSpec(1);
        const adminGen = await dbInsertAdmin(db, specIn);
        const admin = await dbSelectAdmin(db, adminGen.adminId);
        expect(admin).not.toBeNull();
        expect(admin?.adminCreationTime).toBeTruthy();
        expect(admin?.adminModificationTime).toBeTruthy();
        expect(admin?.adminModificationTime).toEqual(admin?.adminCreationTime);
        const mapper = getAdminMapper();
        const specOut = mapper.mapAdminRecordToAdminSpec(guaranteed(admin));
        expect(specOut).toMatchObject(specIn);
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
        const specIn = await adminSpec(2);
        const adminGen = await dbInsertAdmin(db, specIn);
        const adminId = await dbSelectAdminIdByAdminHashedEmail(
          db,
          specIn.adminHashedEmail,
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
