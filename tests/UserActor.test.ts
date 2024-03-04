import { withDb } from "./_db_helpers";
import { UserActor } from "@/lib/user/user-actor";
import { insertUser, getUserActorConfig, userPii } from "./_fixtures";

describe("UserActor", () => {
  it("can retrieve its own actor data from the database", async () => {
    await withDb(async (db) => {
      const user = await insertUser(1, db);
      const config = getUserActorConfig(db);
      const actor = new UserActor(user.userId, config);
      const ownUser = await actor.getOwnUser();
      expect(ownUser).toEqual(user);
    });
  });
  it("can retrieve its own PII", async () => {
    await withDb(async (db) => {
      const user = await insertUser(1, db);
      const config = getUserActorConfig(db);
      const actor = new UserActor(user.userId, config);
      const ownPii = await actor.getOwnPii();
      expect(ownPii).toEqual(userPii(1));
    });
  });
});
