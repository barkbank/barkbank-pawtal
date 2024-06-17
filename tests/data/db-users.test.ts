import {
  dbDeleteUser,
  dbInsertUser,
  dbSelectUser,
  dbSelectUserIdByHashedEmail,
  dbUpdateUser,
} from "@/lib/data/db-users";
import { withDb } from "../_db_helpers";
import { ensureTimePassed, getUserMapper, getUserSpec } from "../_fixtures";
import { guaranteed } from "@/lib/utilities/bark-utils";
import { USER_RESIDENCY } from "@/lib/bark/enums/user-residency";

describe("db-users", () => {
  describe("dbInsertUser", () => {
    it("should insert a new user and return UserGen", async () => {
      await withDb(async (db) => {
        const userGen = await dbInsertUser(db, await getUserSpec(1));
        expect(userGen.userCreationTime).toBeTruthy();
        expect(userGen.userModificationTime).toBeTruthy();
        expect(userGen.userModificationTime).toEqual(userGen.userCreationTime);

        // Additional assertions to verify that the returned types are Dates.
        expect(userGen.userCreationTime instanceof Date).toBe(true);
        expect(userGen.userModificationTime instanceof Date).toBe(true);
        const t = userGen.userCreationTime.getTime();
        expect(typeof t).toEqual("number");
      });
    });
  });
  describe("dbSelectUser", () => {
    it("should return User", async () => {
      await withDb(async (db) => {
        const userGen = await dbInsertUser(db, await getUserSpec(1));
        const user = await dbSelectUser(db, userGen.userId);
        expect(user).not.toBeNull();
        expect(user?.userCreationTime).toEqual(userGen.userCreationTime);
        expect(user?.userModificationTime).toEqual(userGen.userCreationTime);
        const mapper = getUserMapper();
        const spec = mapper.toUserSpec(guaranteed(user));
        expect(spec).toMatchObject(getUserSpec(1));
      });
    });
    it("should return user that does not reside in singapore", async () => {
      await withDb(async (db) => {
        const specIn = await getUserSpec(188);
        specIn.userResidency = USER_RESIDENCY.OTHER;
        const userGen = await dbInsertUser(db, specIn);
        const user = await dbSelectUser(db, userGen.userId);
        expect(user?.userResidency).toEqual(USER_RESIDENCY.OTHER);
      });
    });
    it("should return null when person does not exist", async () => {
      await withDb(async (db) => {
        const user = await dbSelectUser(db, "111");
        expect(user).toBeNull();
      });
    });
  });
  describe("dbSelectUserIdByHashedEmail", () => {
    it("should return user ID of the user matching the hashed email", async () => {
      await withDb(async (db) => {
        const specIn = await getUserSpec(1);
        const userGen = await dbInsertUser(db, specIn);
        const userId = await dbSelectUserIdByHashedEmail(
          db,
          specIn.userHashedEmail,
        );
        expect(userId).toEqual(userGen.userId);
      });
    });
    it("should return null when no user matches the hashed email", async () => {
      await withDb(async (db) => {
        const userId = await dbSelectUserIdByHashedEmail(db, "no-no-no");
        expect(userId).toBeNull();
      });
    });
  });
  describe("dbUpdateUser", () => {
    it("should update user details and modification time", async () => {
      await withDb(async (db) => {
        const specIn1 = await getUserSpec(1);
        const specIn2 = await getUserSpec(2);
        const gen1 = await dbInsertUser(db, specIn1);
        ensureTimePassed();
        const gen2 = await dbUpdateUser(db, gen1.userId, specIn2);
        expect(gen2.userId).toEqual(gen1.userId);
        expect(gen2.userCreationTime).toEqual(gen1.userCreationTime);
        expect(gen2.userModificationTime.getTime()).toBeGreaterThan(
          gen1.userModificationTime.getTime(),
        );
        const user = guaranteed(await dbSelectUser(db, gen1.userId));
        const mapper = getUserMapper();
        const specOut = mapper.toUserSpec(user);
        expect(specOut).toEqual(specIn2);
      });
    });
  });
  describe("dbDeleteUser", () => {
    it("should remove the user record", async () => {
      await withDb(async (db) => {
        const userGen = await dbInsertUser(db, await getUserSpec(1));
        const didDelete = await dbDeleteUser(db, userGen.userId);
        expect(didDelete).toBe(true);
        const user = await dbSelectUser(db, userGen.userId);
        expect(user).toBeNull();
      });
    });
    it("should return false if user does not exist", async () => {
      await withDb(async (db) => {
        const didDelete = await dbDeleteUser(db, "123456");
        expect(didDelete).toBe(false);
      });
    });
  });
});
