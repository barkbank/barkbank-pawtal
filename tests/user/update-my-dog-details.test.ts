import { withDb } from "../_db_helpers";

describe("updateMyDogDetails", () => {
  it("should return OK_UPDATED when successfully updated dog details", async () => {
    await withDb(async (dbPool) => {});
  });
  it("should return ERROR_UNAUTHORIZED when user does not own the dog", async () => {
    await withDb(async (dbPool) => {});
  });
  it("should return ERROR_MISSING_REPORT when dog does not have an existing report", async () => {
    await withDb(async (dbPool) => {});
  });
  it("should return ERROR_MISSING_DOG dog not found", async () => {
    await withDb(async (dbPool) => {});
  });
});
