import { withDb } from "./_db_helpers";
import { UserActor } from "@/lib/user/user-actor";
import { getUserActorConfig, insertUser, userPii } from "./_fixtures";

describe("UserActor", () => {
  it("can retrieve its own actor data from the database", async () => {
    await withDb(async (dbPool) => {
      const user = await insertUser(1, dbPool);
      const actor = new UserActor(user.userId, getUserActorConfig(dbPool));
      const ownUser = await actor.getOwnUserRecord();
      expect(ownUser).toEqual(user);
    });
  });
  it("can retrieve its own PII", async () => {
    await withDb(async (dbPool) => {
      const user = await insertUser(1, dbPool);
      const actor = new UserActor(user.userId, getUserActorConfig(dbPool));
      const ownPii = await actor.getOwnUserPii();
      expect(ownPii).toEqual(userPii(1));
    });
  });
});
