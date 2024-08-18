import { USER_RESIDENCY } from "@/lib/bark/enums/user-residency";
import { USER_TITLE } from "@/lib/bark/enums/user-title";
import {
  UserAccount,
  UserAccountSpec,
  UserAccountSpecSchema,
  UserAccountUpdate,
} from "@/lib/bark/models/user-models";
import { withBarkContext } from "../_context";
import { UserAccountService } from "@/lib/bark/services/user-account-service";
import { CODE } from "@/lib/utilities/bark-code";

describe("UserAccountService", () => {
  describe("create()", () => {
    it("creates user accounts", async () => {
      await withBarkContext(async ({ context }) => {
        const spec: UserAccountSpec = {
          userEmail: "hether.brown@user.com",
          userTitle: USER_TITLE.MS,
          userName: "Hether Brown",
          userPhoneNumber: "6550 1866",
          userResidency: USER_RESIDENCY.SINGAPORE,
        };
        const service = new UserAccountService(context);
        const resCreate = await service.create({ spec });
        const resGet = await service.getByUserId({
          userId: resCreate.result!.userId,
        });
        const acc: UserAccount = resGet.result!;
        expect(acc.userEmail).toEqual(spec.userEmail);
        expect(acc.userTitle).toEqual(spec.userTitle);
        expect(acc.userName).toEqual(spec.userName);
        expect(acc.userPhoneNumber).toEqual(spec.userPhoneNumber);
        expect(acc.userResidency).toEqual(spec.userResidency);
      });
    });
    it("returns ERROR_ACCOUNT_ALREADY_EXISTS when email clashes", async () => {
      await withBarkContext(async ({ context }) => {
        const spec1: UserAccountSpec = {
          userEmail: "same.email@user.com",
          userTitle: USER_TITLE.MS,
          userName: "Hether Brown",
          userPhoneNumber: "6550 1866",
          userResidency: USER_RESIDENCY.SINGAPORE,
        };
        const spec2: UserAccountSpec = {
          userEmail: "same.email@user.com",
          userTitle: USER_TITLE.MR,
          userName: "Ralph Roger",
          userPhoneNumber: "1234 5555",
          userResidency: USER_RESIDENCY.OTHER,
        };
        const service = new UserAccountService(context);
        const res1 = await service.create({ spec: spec1 });
        const res2 = await service.create({ spec: spec2 });
        expect(res1.error).toBeUndefined();
        expect(res2.error).toEqual(CODE.ERROR_ACCOUNT_ALREADY_EXISTS);
      });
    });
  });
  describe("getByUserId()", () => {
    it("returns ERROR_USER_NOT_FOUND when no account exists", async () => {
      await withBarkContext(async ({ context }) => {
        const service = new UserAccountService(context);
        const { result, error } = await service.getByUserId({ userId: "123" });
        expect(result).toBeUndefined();
        expect(error).toEqual(CODE.ERROR_USER_NOT_FOUND);
      });
    });
  });
  describe("applyUpdate()", () => {
    it("updates user account", async () => {
      await withBarkContext(async ({ context }) => {
        const spec: UserAccountSpec = {
          userEmail: "hether.brown@user.com",
          userTitle: USER_TITLE.MS,
          userName: "Hether Brown",
          userPhoneNumber: "6550 1866",
          userResidency: USER_RESIDENCY.SINGAPORE,
        };
        const update: UserAccountUpdate = {
          userTitle: USER_TITLE.MRS,
          userName: "Hether WILLIAMS",
          userPhoneNumber: "1800 888 818",
          userResidency: USER_RESIDENCY.OTHER,
        };
        const service = new UserAccountService(context);
        const res1 = await service.create({ spec });
        const { userId } = res1.result!;
        const res2 = await service.applyUpdate({ userId, update });
        expect(res2).toEqual(CODE.OK);
        const res3 = await service.getByUserId({ userId });
        const acc: UserAccount = res3.result!;
        expect(acc.userEmail).toEqual(spec.userEmail);
        expect(acc.userTitle).toEqual(update.userTitle);
        expect(acc.userName).toEqual(update.userName);
        expect(acc.userPhoneNumber).toEqual(update.userPhoneNumber);
        expect(acc.userResidency).toEqual(update.userResidency);
      });
    });
  });
  describe("getAll()", () => {
    it("returns all users", async () => {
      await withBarkContext(async ({ context }) => {
        const spec1 = _mockSpec(1);
        const spec2 = _mockSpec(2);
        const service = new UserAccountService(context);
        await service.create({ spec: spec1 });
        await service.create({ spec: spec2 });
        const res = await service.getAll();
        const [u1, u2] = res.result!;
        expect(u1.userName).toEqual(spec1.userName);
        expect(u2.userName).toEqual(spec2.userName);
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
