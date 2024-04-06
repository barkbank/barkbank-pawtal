import { withDb } from "../_db_helpers";
import {
  getUserActor,
  insertCall,
  insertDog,
  insertUser,
  insertVet,
} from "../_fixtures";
import { getMyLatestCall } from "@/lib/user/actions/get-my-latest-call";

describe("getMyLatestCall", () => {
  it("should return the latest call if the user owns a pet and has calls", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      const { vetId } = await insertVet(1, dbPool);
      const { dogId } = await insertDog(1, userId, dbPool);
      await insertCall(dbPool, dogId, vetId, "DECLINED");
      await insertCall(dbPool, dogId, vetId, "OPT_OUT");
      await insertCall(dbPool, dogId, vetId, "APPOINTMENT");

      const call = await getMyLatestCall(getUserActor(dbPool, userId));

      expect(call?.callId).toEqual("3");
    });
  });
  it("should return the latest call if the user owns multiple pets and has calls", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      const { vetId } = await insertVet(1, dbPool);
      const { dogId: dogId2 } = await insertDog(2, userId, dbPool);
      const { dogId: dogId1 } = await insertDog(1, userId, dbPool);
      await insertCall(dbPool, dogId1, vetId, "DECLINED");
      await insertCall(dbPool, dogId2, vetId, "OPT_OUT");

      const call = await getMyLatestCall(getUserActor(dbPool, userId));

      expect(call?.callId).toEqual("2");
    });
  });
  it("should return empty if the user owns a pet but has no calls", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      await insertDog(1, userId, dbPool);
      const call = await getMyLatestCall(getUserActor(dbPool, userId));
      expect(call).toBeNull();
    });
  });
});
