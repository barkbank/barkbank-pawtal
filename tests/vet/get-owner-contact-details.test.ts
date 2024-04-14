import { withDb } from "../_db_helpers";

describe("getOwnerContactDetails", () => {
  it("should return a dog's owner contact details", async () => {
    await withDb(async (dbPool) => {});
  });
  it("should return ERROR_UNAUTHORIZED is vet is not a preferred vet", async () => {
    await withDb(async (dbPool) => {});
  });
});
