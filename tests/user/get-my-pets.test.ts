import { withDb } from "../_db_helpers";
import {
  getDogOii,
  getUserActor,
  insertCall,
  insertDog,
  insertReport,
  insertUser,
  insertVet,
} from "../_fixtures";
import { getMyPets } from "@/lib/user/actions/get-my-pets";
import { CALL_OUTCOME } from "@/lib/data/db-enums";
import { guaranteed } from "@/lib/utilities/bark-utils";

describe("getMyPets", () => {
  it("should return empty list when user has no dogs", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(34, dbPool);
      const actor = getUserActor(dbPool, userId);
      const dogs = await getMyPets(actor);
      expect(dogs).toEqual([]);
    });
  });
  it("should return a list of dogs belonging to the user", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      await insertDog(2, userId, dbPool);
      await insertDog(3, userId, dbPool);
      const actor = getUserActor(dbPool, userId);
      const dogs = await getMyPets(actor);
      const receivedName = dogs.map((dog) => dog.dogName);
      const expectedNames = await Promise.all(
        [2, 3].map(async (idx) => {
          const oii = await getDogOii(idx);
          return oii.dogName;
        }),
      );
      expect(receivedName.sort()).toEqual(expectedNames.sort());
    });
  });
  it("should return appointment details when there is an appointment pending report", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      const { dogId } = await insertDog(2, userId, dbPool);
      const { vetId, vetName } = await insertVet(3, dbPool);
      const { callId } = await insertCall(
        dbPool,
        dogId,
        vetId,
        CALL_OUTCOME.APPOINTMENT,
      );
      const actor = getUserActor(dbPool, userId);
      const dogs = await getMyPets(actor);
      expect(guaranteed(dogs[0].dogAppointments[0]).vetName).toEqual(vetName);
    });
  });
  it("should NOT return appointment details when the report has been submitted", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      const { dogId } = await insertDog(2, userId, dbPool);
      const { vetId, vetName } = await insertVet(3, dbPool);
      const { callId } = await insertCall(
        dbPool,
        dogId,
        vetId,
        CALL_OUTCOME.APPOINTMENT,
      );
      const { reportId } = await insertReport(dbPool, callId);
      const actor = getUserActor(dbPool, userId);
      const dogs = await getMyPets(actor);
      expect(dogs[0].dogAppointments).toEqual([]);
    });
  });
});
