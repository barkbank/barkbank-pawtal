import { getMyPets } from "@/lib/user/actions/get-my-pets";
import { withDb } from "../_db_helpers";
import {
  getDogOii,
  getUserActor,
  insertCall,
  insertDog,
  insertUser,
  insertVet,
} from "../_fixtures";
import { getMyLatestCall } from "@/lib/user/actions/get-my-latest-call";

describe("getMyLatestCall", () => {
  // return NIL if the user doesn't own a pet
  // return NIL if the user owns a pet but has no calls
  // return the latest call if the user owns a pet and has calls
  // return the latest call if the user owns multiple pets and has calls

  it("should return the latest call if the user owns a pet and has calls", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      const { vetId } = await insertVet(1, dbPool);
      const { dogId } = await insertDog(1, userId, dbPool);
      await insertCall(dbPool, dogId, vetId, "DECLINED");
      await insertCall(dbPool, dogId, vetId, "OPT_OUT");
      await insertCall(dbPool, dogId, vetId, "APPOINTMENT"); // Should return this

      const call = await getMyLatestCall(getUserActor(dbPool, userId));

      expect(call?.callId).toEqual("3");
    });
  });
});
