import { AccountType } from "@/lib/auth-models";
import { withDb } from "../_db_helpers";
import { getEmailOtpService, insertUser, userPii } from "../_fixtures";
import { HarnessFailureEmailService } from "../_harness";

describe("EmailOtpService::sendOtp", () => {
  it("should return NO_ACCOUNT when email is not an existing user account", async () => {
    await withDb(async (dbPool) => {
      const service = getEmailOtpService(dbPool);
      const res = await service.sendOtp({
        emailAddress: "nouser@user.com",
        accountType: AccountType.USER,
      });
      expect(res).toEqual("NO_ACCOUNT");
    });
  });
  it("should return NO_ACCOUNT when email is not an existing vet account", async () => {
    await withDb(async (dbPool) => {
      const service = getEmailOtpService(dbPool);
      const res = await service.sendOtp({
        emailAddress: "novet@vet.com",
        accountType: AccountType.VET,
      });
      expect(res).toEqual("NO_ACCOUNT");
    });
  });
  it("should return NO_ACCOUNT when email is not an existing admin account", async () => {
    await withDb(async (dbPool) => {
      const service = getEmailOtpService(dbPool);
      const res = await service.sendOtp({
        emailAddress: "noadmin@admin.com",
        accountType: AccountType.ADMIN,
      });
      expect(res).toEqual("NO_ACCOUNT");
    });
  });
  it("should return SEND_FAILED when email failed to send", async () => {
    await withDb(async (dbPool) => {
      const service = getEmailOtpService(dbPool, {
        emailService: new HarnessFailureEmailService(),
      });
      await insertUser(7, dbPool);
      const { userEmail } = userPii(7);
      const res = await service.sendOtp({
        emailAddress: userEmail,
        accountType: AccountType.USER,
      });
      expect(res).toEqual("SEND_FAILED");
    });
  });
  it("should return OK when email was sent", async () => {
    await withDb(async (dbPool) => {
      const service = getEmailOtpService(dbPool);
      await insertUser(7, dbPool);
      const { userEmail } = userPii(7);
      const res = await service.sendOtp({
        emailAddress: userEmail,
        accountType: AccountType.USER,
      });
      expect(res).toEqual("OK");
    });
  });
});
