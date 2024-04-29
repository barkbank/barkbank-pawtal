import { MyAccountDetailsUpdate } from "@/lib/user/user-models";
import { withDb } from "../_db_helpers";
import { getUserActor, insertUser } from "../_fixtures";
import { updateMyAccountDetails } from "@/lib/user/actions/update-my-account-details";
import { USER_RESIDENCY } from "@/lib/data/db-enums";
import { getMyAccount } from "@/lib/user/actions/get-my-account";

describe("updateMyAccountDetails", () => {
  it("should return OK when successfully updated account details", async () => {
    await withDb(async (dbPool) => {
      const user = await insertUser(1, dbPool);
      const actor = getUserActor(dbPool, user.userId);

      const update: MyAccountDetailsUpdate = {
        userName: "New Name",
        userPhoneNumber: "+65 12345678",
        userResidency: USER_RESIDENCY.OTHER,
      };

      const res = await updateMyAccountDetails(actor, update);
      expect(res).toEqual("OK");

      const account = await getMyAccount(actor);
      // console.log(JSON.stringify(account));
      const { userName, userPhoneNumber, userResidency } = account!;

      expect(userName).toEqual(update.userName);
      expect(userPhoneNumber).toEqual(update.userPhoneNumber);
      expect(userResidency).toEqual(update.userResidency);
    });
  });
});
