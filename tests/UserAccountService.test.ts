import { withDb } from "./_db_helpers";
import { insertUser, userPii } from "./_fixtures";
import { Pool } from "pg";
import { UserAccountService } from "@/lib/user/user-account-service";
import { HarnessEncryptionService, HarnessHashService } from "./_harness";

describe("UserAccountService", () => {
  describe("getUserIdByEmail", () => {
    it("should return the ID of user that matches the email", async () => {
      await withDb(async (db) => {
        // GIVEN an existing user;
        const user = await insertUser(7, db);

        // WHEN getUserIdByEmail is called with that user's email;
        const service = await getService(db);
        const userId = await service.getUserIdByEmail(userPii(7).userEmail);

        // THEN the user ID of that user should be returned.
        expect(userId).toEqual(user.userId);
      });
    });
    it("should return null if the provided email belongs to no user", async () => {
      await withDb(async (db) => {
        // WHEN getUserIdByEmail is called with an email that does not match
        // any existing user;
        const service = await getService(db);
        const userId = await service.getUserIdByEmail("nobody@email.com");

        // THEN null is expected.
        expect(userId).toBeNull();
      });
    });
  });
  describe("getUser", () => {
    it("should return the user matching the user ID", async () => {
      await withDb(async (db) => {
        // GIVEN an existing user;
        const userIn = await insertUser(5, db);

        // WHEN getUser is called with the ID of that user;
        const service = await getService(db);
        const userOut = await service.getUser(userIn.userId);

        // THEN the user record for that user should be returned.
        expect(userOut).toEqual(userIn);
      });
    });
    it("should reutrn null if the user ID matches no user record", async () => {
      await withDb(async (db) => {
        // WHEN getUser is called with an ID that matches that of no user;
        const service = await getService(db);
        const userOut = await service.getUser("12345");

        // THEN null should be returned.
        expect(userOut).toBeNull();
      });
    });
  });
  describe("getUserPii", () => {
    it("should return the PII of the user", async () => {
      await withDb(async (db) => {
        // GIVEN a user record;
        const rec = await insertUser(88, db);

        // WHEN getUserPii is called with the record;
        const service = await getService(db);
        const pii = await service.getUserPii(rec);

        // THEN the PII from the record should be decrypted and returned.
        expect(pii).toEqual(userPii(88));
      });
    });
  });
});

async function getService(dbPool: Pool): Promise<UserAccountService> {
  return new UserAccountService({
    dbPool,
    piiEncryptionService: new HarnessEncryptionService(),
    emailHashService: new HarnessHashService(),
  });
}
