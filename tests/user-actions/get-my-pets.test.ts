import { Pool } from "pg";
import { withDb } from "../_db_helpers";
import {
  getDogMapper,
  getDogOii,
  insertCall,
  insertDog,
  insertReport,
  insertUser,
  insertVet,
} from "../_fixtures";
import { getMyPets } from "@/lib/user/actions/get-my-pets";
import { DogMapper } from "@/lib/data/dog-mapper";
import { CALL_OUTCOME } from "@/lib/data/db-enums";
import { guaranteed } from "@/lib/utilities/bark-utils";

describe("getMyPets", () => {
  const dogMapper = getDogMapper();

  function getArgs(
    userId: string,
    dbPool: Pool,
  ): {
    userId: string;
    dbPool: Pool;
    dogMapper: DogMapper;
  } {
    return { userId, dbPool, dogMapper };
  }

  it("should return empty list when user has no dogs", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(34, dbPool);
      const args = getArgs(userId, dbPool);
      const dogs = await getMyPets(args);
      expect(dogs).toEqual([]);
    });
  });
  it("should return a list of dogs belonging to the user", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      await insertDog(2, userId, dbPool);
      await insertDog(3, userId, dbPool);
      const args = getArgs(userId, dbPool);
      const dogs = await getMyPets(args);
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
      const args = getArgs(userId, dbPool);
      const dogs = await getMyPets(args);
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
      const args = getArgs(userId, dbPool);
      const dogs = await getMyPets(args);
      expect(dogs[0].dogAppointments).toEqual([]);
    });
  });
});
