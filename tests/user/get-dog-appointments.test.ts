import { withDb } from "../_db_helpers";

describe("getDogAppointments", () => {
  it("should reutrn ERROR_DOG_NOT_FOUND when dog cannot be found", async () => {
    await withDb(async (dbPool) => {});
  });
  it("should reutrn ERROR_WRONG_OWNER if the user does not own the dog", async () => {
    await withDb(async (dbPool) => {});
  });
  it("should reutrn appointments of the dog", async () => {
    await withDb(async (dbPool) => {});
  });
});
