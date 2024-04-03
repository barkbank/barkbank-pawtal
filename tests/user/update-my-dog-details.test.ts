import { MyDogDetailsUpdate } from "@/lib/user/user-models";
import { withDb } from "../_db_helpers";
import {
  CALL_OUTCOME,
  PARTICIPATION_STATUS,
  YesNoUnknown,
} from "@/lib/data/db-enums";
import {
  getDogMapper,
  getUserActor,
  insertCall,
  insertDog,
  insertReport,
  insertUser,
  insertVet,
} from "../_fixtures";
import { updateMyDogDetails } from "@/lib/user/actions/update-my-dog-details";
import { Pool, PoolClient } from "pg";
import { dbBegin, dbQuery, dbRelease } from "@/lib/data/db-utils";
import { dbInsertDogVetPreference } from "@/lib/data/db-dogs";

describe("updateMyDogDetails", () => {
  it("should return OK_UPDATED when successfully updated dog details", async () => {
    await withDb(async (dbPool) => {
      // GIVEN users u1 with dog d1 and preferred vet v1
      const u1 = await insertUser(1, dbPool);
      const d1 = await insertDog(1, u1.userId, dbPool);
      const v1 = await insertVet(1, dbPool);
      await dbInsertDogVetPreference(dbPool, d1.dogId, v1.vetId);
      const c1 = await insertCall(
        dbPool,
        d1.dogId,
        v1.vetId,
        CALL_OUTCOME.APPOINTMENT,
      );
      const r1 = await insertReport(dbPool, c1.callId);

      // WHEN
      const v2 = await insertVet(2, dbPool);
      const actor1 = getUserActor(dbPool, u1.userId);
      const update = detailsUpdate(d1.dogId, {
        dogPreferredVetId: v2.vetId,
      });
      const res = await updateMyDogDetails(actor1, update);

      // THEN
      expect(res).toEqual("OK_UPDATED");
      const dataInDb = await reconstructUpdateFromDb(dbPool, d1.dogId);
      expect(dataInDb).toEqual(update);
    });
  });
  it("should return ERROR_UNAUTHORIZED when user does not own the dog", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const d1 = await insertDog(1, u1.userId, dbPool);

      // WHEN u2 tries to update u1's dog
      const u2 = await insertUser(2, dbPool);
      const update = detailsUpdate(d1.dogId);
      const actor = getUserActor(dbPool, u2.userId);
      const res = await updateMyDogDetails(actor, update);
      expect(res).toEqual("ERROR_UNAUTHORIZED");
    });
  });
  it("should return ERROR_MISSING_REPORT when dog does not have an existing report", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const d1 = await insertDog(1, u1.userId, dbPool);
      const update = detailsUpdate(d1.dogId);
      const actor = getUserActor(dbPool, u1.userId);
      const res = await updateMyDogDetails(actor, update);
      expect(res).toEqual("ERROR_MISSING_REPORT");
    });
  });
  it("should return ERROR_MISSING_DOG dog not found", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const unknownDogId = "123";
      const update = detailsUpdate(unknownDogId);
      const actor = getUserActor(dbPool, u1.userId);
      const res = await updateMyDogDetails(actor, update);
      expect(res).toEqual("ERROR_MISSING_DOG");
    });
  });
});

function detailsUpdate(
  dogId: string,
  overrides?: Partial<MyDogDetailsUpdate>,
): MyDogDetailsUpdate {
  const base: MyDogDetailsUpdate = {
    dogId,
    dogName: "updated name",
    dogWeightKg: 50,
    dogEverPregnant: YesNoUnknown.NO,
    dogEverReceivedTransfusion: YesNoUnknown.NO,
    dogPreferredVetId: null,
    dogParticipationStatus: PARTICIPATION_STATUS.PARTICIPATING,
    // TODO: dogPauseEndReason: string; When the schema supports it
    dogPauseExpiryTime: null,
  };
  return { ...base, ...overrides };
}

async function reconstructUpdateFromDb(
  dbPool: Pool,
  dogId: string,
): Promise<Partial<MyDogDetailsUpdate>> {
  const conn = await dbPool.connect();
  try {
    await dbBegin(conn);
    const fieldsPart = await fetchDogFields(conn, dogId);
    const vetPart = await fetchDogPreferredVetId(conn, dogId);
    return { ...fieldsPart, ...vetPart };
  } finally {
    await dbRelease(conn);
  }
}

async function fetchDogFields(
  conn: PoolClient,
  dogId: string,
): Promise<Partial<MyDogDetailsUpdate>> {
  const sql = `
  select
    dog_encrypted_oii as "dogEncryptedOii",
    dog_weight_kg as "dogWeightKg",
    dog_ever_pregnant as "dogEverPregnant",
    dog_ever_received_transfusion as "dogEverReceivedTransfusion",
    dog_participation_status as "dogParticipationStatus",
    dog_pause_expiry_time as "dogPauseExpiryTime"
  from dogs
  where dog_id = $1
  `;
  const res = await dbQuery(conn, sql, [dogId]);
  const { dogEncryptedOii, ...dogFields } = res.rows[0];
  const { dogName } = await getDogMapper().mapDogSecureOiiToDogOii({
    dogEncryptedOii,
  });
  return { dogId, dogName, ...dogFields };
}

async function fetchDogPreferredVetId(
  conn: PoolClient,
  dogId: string,
): Promise<Partial<MyDogDetailsUpdate>> {
  const sql = `
  select vet_id as "dogPreferredVetId"
  from dog_vet_preferences
  where dog_id = $1
  `;
  const res = await dbQuery(conn, sql, [dogId]);
  if (res.rows.length === 0) {
    return { dogPreferredVetId: null };
  }
  if (res.rows.length > 1) {
    return { dogPreferredVetId: "MORE_THAN_ONE" };
  }
  const { dogPreferredVetId } = res.rows[0];
  return { dogPreferredVetId };
}
