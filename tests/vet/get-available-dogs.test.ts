import { getAvailableDogs } from "@/lib/vet/actions/get-available-dogs";
import { withDb } from "../_db_helpers";
import {
  getDogOii,
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
} from "@/lib/data/db-enums";
import { YES_NO_UNKNOWN } from "@/lib/bark/enums/yes-no-unknown";
import { AvailableDog } from "@/lib/vet/vet-models";
import { dbQuery } from "@/lib/data/db-utils";

// WIP: Delete tests for getAvailableDogs when migrated to call tasks
describe("getAvailableDogs", () => {
  it("should return available dog", async () => {
    await withDb(async (dbPool) => {
      // GIVEN
      const { vetId } = await insertVet(1, dbPool);

      // AND
      const { availableDog } = await insertAvailableDog(vetId, 2, dbPool);

      // WHEN
      const actor = getVetActor(vetId, dbPool);
      const dogs = await getAvailableDogs(actor);

      // THEN
      expect(dogs).toEqual([availableDog]);
    });
  });
  it("should not return available dog that prefers another vet", async () => {
    await withDb(async (dbPool) => {
      // GIVEN
      const { vetId } = await insertVet(1, dbPool);

      // AND
      const { vetId: otherVetId } = await insertVet(2, dbPool);
      const { availableDog } = await insertAvailableDog(otherVetId, 2, dbPool);

      // WHEN
      const actor = getVetActor(vetId, dbPool);
      const dogs = await getAvailableDogs(actor);

      // THEN
      expect(dogs).toEqual([]);
    });
  });
  it("should return available dog whose owner previously declined", async () => {
    await withDb(async (dbPool) => {
      // GIVEN
      const { vetId } = await insertVet(1, dbPool);

      // AND
      const { availableDog, dogId } = await insertAvailableDog(
        vetId,
        2,
        dbPool,
      );

      // AND
      await insertCall(dbPool, dogId, vetId, CALL_OUTCOME.DECLINED);

      // WHEN
      const actor = getVetActor(vetId, dbPool);
      const dogs = await getAvailableDogs(actor);

      // THEN
      expect(dogs).toEqual([availableDog]);
    });
  });
  it("should not return unavailable dogs", async () => {
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

async function insertAvailableDog(
  vetId: string,
  idx: number,
  dbPool: Pool,
): Promise<{ userId: string; dogId: string; availableDog: AvailableDog }> {
  const { userId } = await insertUser(idx, dbPool);
  const spec = getEligibleDogSpecOverrides();
  const { dogId } = await insertDog(idx, userId, dbPool, spec);
  await dbInsertDogVetPreference(dbPool, dogId, vetId);
  const { dogName } = await getDogOii(idx);
  const sql = `
  select
    dog_id as "dogId",
    $2 as "dogName",
    dog_breed as "dogBreed",
    dog_birthday as "dogBirthday",
    dog_gender as "dogGender",
    dog_weight_kg as "dogWeightKg",
    dog_ever_received_transfusion as "dogEverReceivedTransfusion",
    dog_ever_pregnant as "dogEverPregnant"
  from dogs
  where dog_id = $1
  `;
  const res = await dbQuery<AvailableDog>(dbPool, sql, [dogId, dogName]);
  const availableDog = res.rows[0];
  return { userId, dogId, availableDog };
}

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
