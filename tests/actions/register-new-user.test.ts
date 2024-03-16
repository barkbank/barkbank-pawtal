import { withDb } from "../_db_helpers";

describe("registerNewUser", () => {
  it("should return ERR_INVALID_OTP when OTP is invalid", async () => {
    await withDb(async (dbPool) => {
      const config = { dbPool };
      fail("WIP: implement this test");
    });
  });
  it("should return ERR_USER_EXISTS when user already exists", async () => {
    await withDb(async (dbPool) => {
      const config = { dbPool };
      fail("WIP: implement this test");
    });
  });
  it("should return OK when user account is successfully created", async () => {
    await withDb(async (dbPool) => {
      const config = { dbPool };
      fail("WIP: implement this test");
    });
  });
});
