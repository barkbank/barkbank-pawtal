import { EncryptedUserAccountDao } from "@/lib/bark/daos/encrypted-user-account-dao";
import { withBarkContext } from "../_context";
import {
  UserAccountSpec,
  UserAccountSpecSchema,
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
        const spec = _mockSpec(66);
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
  describe("getAll", () => {
    it("returns all users in userId order", async () => {
      await withBarkContext(async ({ context }) => {
        const { dbPool } = context;
        const spec1 = _mockSpec(1);
        const spec2 = _mockSpec(2);
        const dao = new EncryptedUserAccountDao(dbPool);
        const enc1 = await toEncryptedUserAccountSpec(context, spec1);
        const enc2 = await toEncryptedUserAccountSpec(context, spec2);
        const u1 = await dao.insert({ spec: enc1 });
        const u2 = await dao.insert({ spec: enc2 });
        expect(parseInt(u1.userId)).toBeLessThan(parseInt(u2.userId));
        const all = await dao.getAll();
        const [a1, a2] = all;
        expect(a1.userId).toEqual(u1.userId);
        expect(a2.userId).toEqual(u2.userId);
        expect(a1.userEncryptedPii).toEqual(enc1.userEncryptedPii);
        expect(a2.userEncryptedPii).toEqual(enc2.userEncryptedPii);
      });
    });
  });
});

function _mockSpec(idx: number): UserAccountSpec {
  const spec: UserAccountSpec = {
    userEmail: `user${idx}@testuser.com`,
    userTitle: USER_TITLE.MR,
    userName: `Tom ${idx}`,
    userPhoneNumber: `3300 100 ${idx}`,
    userResidency: USER_RESIDENCY.SINGAPORE,
  };
  return UserAccountSpecSchema.parse(spec);
}
