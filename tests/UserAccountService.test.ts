import { withDb } from "./_db_helpers";
import { getUserAccountService, insertUser, userPii } from "./_fixtures";

describe("UserAccountService", () => {
  describe("getUserIdByEmail", () => {
    it("should return the ID of user that matches the email", async () => {
      await withDb(async (db) => {
        // GIVEN an existing user;
        const user = await insertUser(7, db);

        // WHEN getUserIdByEmail is called with that user's email;
        const service = await getUserAccountService(db);
        const userId = await service.getUserIdByEmail(userPii(7).userEmail);

        // THEN the user ID of that user should be returned.
        expect(userId).toEqual(user.userId);
      });
    });
    it("should return null if the provided email belongs to no user", async () => {
      await withDb(async (db) => {
        // WHEN getUserIdByEmail is called with an email that does not match
        // any existing user;
        const service = await getUserAccountService(db);
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
        const service = await getUserAccountService(db);
        const userOut = await service.getUser(userIn.userId);

        // THEN the user record for that user should be returned.
        expect(userOut).toEqual(userIn);
      });
    });
    it("should reutrn null if the user ID matches no user record", async () => {
      await withDb(async (db) => {
        // WHEN getUser is called with an ID that matches that of no user;
        const service = await getUserAccountService(db);
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
        const service = await getUserAccountService(db);
        const pii = await service.getUserPii(rec);

        // THEN the PII from the record should be decrypted and returned.
        expect(pii).toEqual(userPii(88));
      });
    });
  });
  describe("createUserAccount", () => {
    it("should create new user account with dog", async () => {
      await withDb(async (db) => {
        // WHEN createUserAccount is called with details about a user and one
        // dog; THEN a user account should be created for the user detailed; AND
        // a dog record should be created for the one dog; AND the owner of that
        // dog should be the created user account; AND the createUserAccount
        // method should return True.
      });
    });
    it("should not create user account when there is an existing account", async () => {
      await withDb(async (db) => {
        // GIVEN there is an existing user; WHEN createUserAccount is called
        // with details about a user and one dog; AND this user has the same
        // email as the existing user; THEN no data shall be added to the
        // database; AND the createUserAccount method should return False. (I.e.
        // rollback)
      });
    });
    it("should create user accounts atomically", async () => {
      await withDb(async (db) => {
        // GIVEN details about a user and one dog; AND 10 un-awaited promises
        // from calling createUserAccount with same user and dog details; WHEN
        // the promises are all awaited concurrently (i.e. using Promise.all);
        // THEN at exactly one promise should result in True; AND a user account
        // should be created for the user detailed; AND a dog record should be
        // created for the one dog; AND the owner of that dog should be the
        // created user account.
      });
    });
    it("should support the creation of accounts with multiple dogs", async () => {
      await withDb(async (db) => {
        // WHEN createUserAccount is called with details about a user and three
        // dogs; THEN a user account should be created for the user detailed;
        // AND three dog records should be created; AND the owner of those dogs
        // should be the created user account; AND the createUserAccount method
        // should return True.
      });
    });
  });
});
