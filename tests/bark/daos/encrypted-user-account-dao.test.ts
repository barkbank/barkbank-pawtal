import { EncryptedUserAccountDao } from "@/lib/bark/daos/encrypted-user-account-dao";
import { withBarkContext } from "../_context";
import {
  EncryptedUserAccountSpec,
  UserAccountSpec,
} from "@/lib/bark/models/user-models";
import { USER_TITLE } from "@/lib/bark/enums/user-title";
import { USER_RESIDENCY } from "@/lib/bark/enums/user-residency";
import {
  toEncryptedUserAccountSpec,
  toUserAccount,
} from "@/lib/bark/mappers/user-mappers";

describe("EncryptedUserAccountDao", () => {
  describe("getByUserId", () => {
    it("returns null when no account exists for the specified userId", async () => {
      await withBarkContext(async ({ context }) => {
        const dao = new EncryptedUserAccountDao(context.dbPool);
        const acc = await dao.getByUserId({ userId: "123" });
        expect(acc).toBeNull();
      });
    });
    it("returns encrypted user account for the specified userId", async () => {
      await withBarkContext(async ({ context }) => {
        const spec: UserAccountSpec = {
          userEmail: "grinch@christmas.co",
          userTitle: USER_TITLE.MR,
          userName: "Greg Inch",
          userPhoneNumber: "1800 642 866",
          userResidency: USER_RESIDENCY.OTHER,
        };
        const encryptedSpec = await toEncryptedUserAccountSpec(context, spec);
        const dao = new EncryptedUserAccountDao(context.dbPool);
        const { userId } = await dao.insert({ spec: encryptedSpec });
        const encryptedAcc = await dao.getByUserId({ userId });
        const acc = await toUserAccount(context, encryptedAcc!);
        expect(acc.userEmail).toEqual(spec.userEmail);
        expect(acc.userTitle).toEqual(spec.userTitle);
        expect(acc.userName).toEqual(spec.userName);
        expect(acc.userPhoneNumber).toEqual(spec.userPhoneNumber);
        expect(acc.userResidency).toEqual(spec.userResidency);
      });
    });
  });
});
