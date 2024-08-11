import { withDb } from "../_db_helpers";
import { getUserActor, insertUser } from "../_fixtures";
import { updateMyAccountDetails } from "@/lib/user/actions/update-my-account-details";
import { USER_RESIDENCY } from "@/lib/bark/enums/user-residency";
import { UserAccountUpdate } from "@/lib/bark/models/user-models";

describe("updateMyAccountDetails", () => {
  it("should return OK when successfully updated account details", async () => {
    await withDb(async (dbPool) => {
      const user = await insertUser(1, dbPool);
      const actor = getUserActor(dbPool, user.userId);

      const update: UserAccountUpdate = {
        userName: "New Name",
        userPhoneNumber: "+65 12345678",
        userResidency: USER_RESIDENCY.OTHER,
      };

      const res = await updateMyAccountDetails(actor, update);
      expect(res).toEqual("OK");

      const account = await actor.getMyAccount();
      expect(account).not.toBeUndefined();

      const { userName, userPhoneNumber, userResidency } = account!;
      expect(userName).toEqual(update.userName);
      expect(userPhoneNumber).toEqual(update.userPhoneNumber);
      expect(userResidency).toEqual(update.userResidency);
    });
  });
});
