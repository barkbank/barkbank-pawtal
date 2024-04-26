import { getDogStatuses } from "@/lib/user/actions/get-dog-statuses";
import { withDb } from "../_db_helpers";
import { getUserActor, insertDog, insertUser } from "../_fixtures";

describe("getDogStatuses", () => {
  it("should return ERROR_UNAUTHORIZED when the user does not own the requested dog", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const u2 = await insertUser(2, dbPool);
      const d3 = await insertDog(3, u2.userId, dbPool);
      const actor = getUserActor(dbPool, u1.userId);
      const { result, error } = await getDogStatuses(actor, d3.dogId);
      expect(result).toBeUndefined();
      expect(error).toEqual("ERROR_UNAUTHORIZED");
    });
  });
  it("should return ERROR_MISSING_DOG when the requested dog does not exist", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const noSuchDogId = "1234567";
      const actor = getUserActor(dbPool, u1.userId);
      const { result, error } = await getDogStatuses(actor, noSuchDogId);
      expect(result).toBeUndefined();
      expect(error).toEqual("ERROR_MISSING_DOG");
    });
  });
  it("WIP: should return statuses of the requested dog", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const d2 = await insertDog(2, u1.userId, dbPool, {});
      const actor = getUserActor(dbPool, u1.userId);
      const { result, error } = await getDogStatuses(actor, d2.dogId);
      expect(result).toEqual({});
      expect(error).toBeUndefined();
    });
  });
});
