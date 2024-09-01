import {
  dbDeleteUser,
  dbInsertUser,
  dbSelectUser,
  dbSelectUserIdByHashedEmail,
} from "@/lib/data/db-users";
import { withDb } from "../_db_helpers";
import { getUserMapper, getUserSpec } from "../_fixtures";
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
