import { getAvailableDogs } from "@/lib/vet/actions/get-available-dogs";
import { withDb } from "../_db_helpers";
import {
  getEligibleDogSpecOverrides,
  getVetActor,
  insertCall,
  insertDog,
  insertUser,
  insertVet,
} from "../_fixtures";
import { Pool } from "pg";
import {
  dbInsertDogVetPreference,
  dbUpdateDogParticipation,
} from "@/lib/data/db-dogs";
import {
  CALL_OUTCOME,
  PARTICIPATION_STATUS,
  USER_RESIDENCY,
  YES_NO_UNKNOWN,
} from "@/lib/data/db-enums";

describe("getAvailableDogs", () => {
  it("should return empty list when there are no available dogs", async () => {
    await withDb(async (dbPool) => {
      // GIVEN
      const { vetId } = await insertVet(1, dbPool);

      // AND the following dogs that are not available for various reasons
      await insertDogWithNoVetPreference(1, dbPool);
      await insertDogWithPendingReport(vetId, 2, dbPool);
      await insertDogInOtherCountry(vetId, 3, dbPool);
      await insertDogWithIncompleteProfile(vetId, 4, dbPool);
      await insertDogWithIneligibleMedicalStatus(vetId, 5, dbPool);
      await insertDogWithOptedOutParticipation(vetId, 6, dbPool);

      // WHEN
      const actor = getVetActor(vetId, dbPool);
      const dogs = await getAvailableDogs(actor);

      // THEN
      expect(dogs).toEqual([]);
    });
  });
});

async function insertDogWithNoVetPreference(
  idx: number,
  dbPool: Pool,
): Promise<{ userId: string; dogId: string }> {
  const { userId } = await insertUser(idx, dbPool);
  const spec = getEligibleDogSpecOverrides();
  const { dogId } = await insertDog(idx, userId, dbPool, spec);
  return { userId, dogId };
}

async function insertDogWithPendingReport(
  vetId: string,
  idx: number,
  dbPool: Pool,
): Promise<{ userId: string; dogId: string; callId: string }> {
  const { userId } = await insertUser(idx, dbPool);
  const spec = getEligibleDogSpecOverrides();
  const { dogId } = await insertDog(idx, userId, dbPool, spec);
  await dbInsertDogVetPreference(dbPool, dogId, vetId);
  const { callId } = await insertCall(
    dbPool,
    dogId,
    vetId,
    CALL_OUTCOME.APPOINTMENT,
  );
  return { userId, dogId, callId };
}

async function insertDogInOtherCountry(
  vetId: string,
  idx: number,
  dbPool: Pool,
): Promise<{ userId: string; dogId: string }> {
  const { userId } = await insertUser(idx, dbPool, {
    userResidency: USER_RESIDENCY.OTHER,
  });
  const spec = getEligibleDogSpecOverrides();
  const { dogId } = await insertDog(idx, userId, dbPool, spec);
  await dbInsertDogVetPreference(dbPool, dogId, vetId);
  return { userId, dogId };
}

async function insertDogWithIncompleteProfile(
  vetId: string,
  idx: number,
  dbPool: Pool,
): Promise<{ userId: string; dogId: string }> {
  const { userId } = await insertUser(idx, dbPool);
  const base = getEligibleDogSpecOverrides();
  const spec = { ...base, dogWeightKg: null, dogBreed: "" };
  const { dogId } = await insertDog(idx, userId, dbPool, spec);
  await dbInsertDogVetPreference(dbPool, dogId, vetId);
  return { userId, dogId };
}

async function insertDogWithIneligibleMedicalStatus(
  vetId: string,
  idx: number,
  dbPool: Pool,
): Promise<{ userId: string; dogId: string }> {
  const { userId } = await insertUser(idx, dbPool);
  const base = getEligibleDogSpecOverrides();
  const spec = { ...base, dogEverReceivedTransfusion: YES_NO_UNKNOWN.YES };
  const { dogId } = await insertDog(idx, userId, dbPool, spec);
  await dbInsertDogVetPreference(dbPool, dogId, vetId);
  return { userId, dogId };
}

async function insertDogWithOptedOutParticipation(
  vetId: string,
  idx: number,
  dbPool: Pool,
): Promise<{ userId: string; dogId: string }> {
  const { userId } = await insertUser(idx, dbPool);
  const spec = getEligibleDogSpecOverrides();
  const { dogId } = await insertDog(idx, userId, dbPool, spec);
  await dbInsertDogVetPreference(dbPool, dogId, vetId);
  await dbUpdateDogParticipation(dbPool, dogId, {
    participationStatus: PARTICIPATION_STATUS.OPTED_OUT,
  });
  return { userId, dogId };
}
