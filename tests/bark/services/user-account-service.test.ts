import { USER_RESIDENCY } from "@/lib/bark/enums/user-residency";
import { USER_TITLE } from "@/lib/bark/enums/user-title";
import { UserAccount, UserAccountSpec } from "@/lib/bark/models/user-models";
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
});
