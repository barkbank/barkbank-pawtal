import { getMyAccount } from "@/lib/user/actions/get-my-account";
import { withDb } from "../_db_helpers";
import { getUserActor, insertUser } from "../_fixtures";
import { USER_RESIDENCY } from "@/lib/data/db-enums";

describe("getMyAccount", () => {
  it("should return the correct user details", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      const actor = getUserActor(dbPool, userId);
      const account = await getMyAccount(actor);

      const {
        userId: user_id,
        userCreationTime,
        userResidency,
        userEmail,
        userPhoneNumber,
      } = account!;

      expect(user_id).toEqual(userId);
      expect(userCreationTime).toBeDefined();
      expect(userEmail).toEqual("user1@user.com");
      expect(userResidency).toEqual(USER_RESIDENCY.SINGAPORE);
      expect(userPhoneNumber).toEqual("+65 10000001");
    });
  });
  it("should return null if the user does not exist", async () => {
    await withDb(async (dbPool) => {
      const actor = getUserActor(dbPool, "99999999");
      const account = await getMyAccount(actor);
      expect(account).toBeNull();
    });
  });
});
