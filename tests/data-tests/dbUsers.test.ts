import {
  dbDeleteUser,
  dbInsertUser,
  dbSelectUser,
  dbSelectUserIdByHashedEmail,
  dbUpdateUser,
} from "@/lib/data/dbUsers";
import { withDb } from "../_db_helpers";
import { ensureTimePassed, userSpec } from "./_dbFixtures";
import { toUserSpec } from "@/lib/data/mappers";
import { guaranteed } from "@/lib/bark-utils";

describe("dbUsers", () => {
  describe("dbInsertUser", () => {
    it("should insert a new user and return UserGen", async () => {
      await withDb(async (db) => {
        const userGen = await dbInsertUser(db, userSpec(1));
        expect(userGen.userCreationTime).toBeTruthy();
        expect(userGen.userModificationTime).toBeTruthy();
        expect(userGen.userModificationTime).toEqual(userGen.userCreationTime);
      });
    });
  });
  describe("dbSelectUser", () => {
    it("should return User", async () => {
      await withDb(async (db) => {
        const userGen = await dbInsertUser(db, userSpec(1));
        const user = await dbSelectUser(db, userGen.userId);
        expect(user).not.toBeNull();
        expect(user?.userCreationTime).toEqual(userGen.userCreationTime);
        expect(user?.userModificationTime).toEqual(userGen.userCreationTime);
        const spec = toUserSpec(guaranteed(user));
        expect(spec).toMatchObject(userSpec(1));
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
        const userGen = await dbInsertUser(db, userSpec(1));
        const userId = await dbSelectUserIdByHashedEmail(
          db,
          userSpec(1).userHashedEmail,
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
        const gen1 = await dbInsertUser(db, userSpec(1));
        ensureTimePassed();
        const gen2 = await dbUpdateUser(db, gen1.userId, userSpec(2));
        expect(gen2.userId).toEqual(gen1.userId);
        expect(gen2.userCreationTime).toEqual(gen1.userCreationTime);
        expect(gen2.userModificationTime.getTime()).toBeGreaterThan(
          gen1.userModificationTime.getTime(),
        );
        const user = guaranteed(await dbSelectUser(db, gen1.userId));
        const spec = toUserSpec(user);
        expect(spec).toEqual(userSpec(2));
      });
    });
  });
  describe("dbDeleteUser", () => {
    it("should remove the user record", async () => {
      await withDb(async (db) => {
        const userGen = await dbInsertUser(db, userSpec(1));
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
