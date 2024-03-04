import { UserActorFactory } from "@/lib/user/user-actor-factory";
import { withDb } from "./_db_helpers";
import { userPii, insertUser, getUserActorFactoryConfig } from "./_fixtures";

describe("UserActorFactory", () => {
  describe("getUserActor", () => {
    it("should load the UserActor for the corresponding email", async () => {
      await withDb(async (db) => {
        const user = await insertUser(1, db);
        const factory = new UserActorFactory(getUserActorFactoryConfig(db));
        const pii = userPii(1);
        const actor = await factory.getUserActor(pii.userEmail);
        expect(actor?.getUserId()).toEqual(user.userId);
      });
    });
  });
});
