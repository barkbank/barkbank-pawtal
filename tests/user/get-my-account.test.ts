import { getMyAccount } from "@/lib/user/actions/get-my-account";
import { withDb } from "../_db_helpers";
import { getUserActor, insertUser } from "../_fixtures";
import { USER_RESIDENCY } from "@/lib/data/db-enums";
import { expectError } from "../_helpers";

describe("getMyAccount", () => {
  it("should return the correct user details", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      const actor = getUserActor(dbPool, userId);
      const account = await getMyAccount(actor);

      const { userName, userEmail, userPhoneNumber, ...otherFields } = account!;

      expect(otherFields.userCreationTime).toBeDefined();
      expect(userName).toEqual("User 1");
      expect(userEmail).toEqual("user1@user.com");
      expect(otherFields.userResidency).toEqual(USER_RESIDENCY.SINGAPORE);
      expect(userPhoneNumber).toEqual("+65 10000001");
    });
  });
  it("should fail if the user does not exist", async () => {
    await withDb(async (dbPool) => {
      const actor = getUserActor(dbPool, "99999999");
      await expectError(async () => {
        await getMyAccount(actor);
      });
    });
  });
});
