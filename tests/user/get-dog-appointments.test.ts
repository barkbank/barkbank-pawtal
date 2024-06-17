import { getDogAppointments } from "@/lib/user/actions/get-dog-appointments";
import { withDb } from "../_db_helpers";
import {
  getUserActor,
  insertCall,
  insertDog,
  insertUser,
  insertVet,
} from "../_fixtures";
import { CODE } from "@/lib/utilities/bark-code";
import { CALL_OUTCOME } from "@/lib/bark/enums/call-outcome";
import { DogAppointment } from "@/lib/bark/models/dog-appointment";

describe("getDogAppointments", () => {
  it("should return ERROR_DOG_NOT_FOUND when dog cannot be found", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const unknownDogId = "12345";
      const actor = getUserActor(dbPool, u1.userId);
      const { result, error } = await getDogAppointments(actor, unknownDogId);
      expect(error).toEqual(CODE.ERROR_DOG_NOT_FOUND);
      expect(result).toBeUndefined();
    });
  });
  it("should return ERROR_WRONG_OWNER if the user does not own the dog", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const owner = await insertUser(2, dbPool);
      const d1 = await insertDog(1, owner.userId, dbPool);
      const actor = getUserActor(dbPool, u1.userId);
      const { result, error } = await getDogAppointments(actor, d1.dogId);
      expect(error).toEqual(CODE.ERROR_WRONG_OWNER);
      expect(result).toBeUndefined();
    });
  });
  it("should return empty list when there are no appointments", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const d1 = await insertDog(1, u1.userId, dbPool);
      const actor = getUserActor(dbPool, u1.userId);
      const { result, error } = await getDogAppointments(actor, d1.dogId);
      expect(error).toBeUndefined();
      expect(result).toEqual([]);
    });
  });
  it("should return appointments of the dog", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const d1 = await insertDog(1, u1.userId, dbPool);
      const v1 = await insertVet(1, dbPool);
      const c1 = await insertCall(
        dbPool,
        d1.dogId,
        v1.vetId,
        CALL_OUTCOME.APPOINTMENT,
      );
      const actor = getUserActor(dbPool, u1.userId);
      const { result, error } = await getDogAppointments(actor, d1.dogId);
      expect(error).toBeUndefined();
      const expected: DogAppointment = {
        appointmentId: c1.callId,
        dogId: d1.dogId,
        vetId: v1.vetId,
        vetName: v1.vetName,
        vetPhoneNumber: v1.vetPhoneNumber,
        vetAddress: v1.vetAddress,
      };
      expect(result).toEqual([expected]);
    });
  });
});
