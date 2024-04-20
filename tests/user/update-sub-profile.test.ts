import { SubProfile } from "@/lib/user/user-models";
import { withDb } from "../_db_helpers";
import {
  CALL_OUTCOME,
  YES_NO_UNKNOWN,
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
import { updateSubProfile } from "@/lib/user/actions/update-sub-profile";
import { Pool } from "pg";
import { dbQuery } from "@/lib/data/db-utils";
import { dbInsertDogVetPreference } from "@/lib/data/db-dogs";

describe("updateSubProfile", () => {
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
      const update = _getSubProfile({
        dogPreferredVetId: v2.vetId,
      });
      const res = await updateSubProfile(actor1, d1.dogId, update);

      // THEN
      expect(res).toEqual("OK_UPDATED");
      const dataInDb = await _fetchSubProfile(dbPool, d1.dogId);
      expect(dataInDb).toEqual(update);
    });
  });
  it("should return ERROR_UNAUTHORIZED when user does not own the dog", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const d1 = await insertDog(1, u1.userId, dbPool);

      // WHEN u2 tries to update u1's dog
      const u2 = await insertUser(2, dbPool);
      const update = _getSubProfile();
      const actor = getUserActor(dbPool, u2.userId);
      const res = await updateSubProfile(actor, d1.dogId, update);
      expect(res).toEqual("ERROR_UNAUTHORIZED");
    });
  });
  it("should return ERROR_MISSING_REPORT when dog does not have an existing report", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const d1 = await insertDog(1, u1.userId, dbPool);
      const update = _getSubProfile();
      const actor = getUserActor(dbPool, u1.userId);
      const res = await updateSubProfile(actor, d1.dogId, update);
      expect(res).toEqual("ERROR_MISSING_REPORT");
    });
  });
  it("should return ERROR_MISSING_DOG dog not found", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const unknownDogId = "123";
      const update = _getSubProfile();
      const actor = getUserActor(dbPool, u1.userId);
      const res = await updateSubProfile(actor, unknownDogId, update);
      expect(res).toEqual("ERROR_MISSING_DOG");
    });
  });
});

function _getSubProfile(overrides?: Partial<SubProfile>): SubProfile {
  const base: SubProfile = {
    dogName: "updated name",
    dogWeightKg: 50,
    dogEverPregnant: YES_NO_UNKNOWN.NO,
    dogEverReceivedTransfusion: YES_NO_UNKNOWN.NO,
    dogPreferredVetId: "",
  };
  return { ...base, ...overrides };
}

async function _fetchSubProfile(
  dbPool: Pool,
  dogId: string,
): Promise<SubProfile> {
  const sql = `
  SELECT
    tDog.dog_encrypted_oii as "dogEncryptedOii",
    tDog.dog_weight_kg as "dogWeightKg",
    tDog.dog_ever_pregnant as "dogEverPregnant",
    tDog.dog_ever_received_transfusion as "dogEverReceivedTransfusion",
    tPref.vet_id as "dogPreferredVetId"
  FROM dogs as tDog
  LEFT JOIN (
    SELECT dog_id, vet_id
    FROM dog_vet_preferences
    WHERE dog_id = $1
  ) as tPref on tDog.dog_id = tPref.dog_id
  WHERE tDog.dog_id = $1
  `;
  type Row = {
    dogEncryptedOii: string;
    dogWeightKg: number | null;
    dogEverPregnant: YesNoUnknown;
    dogEverReceivedTransfusion: YesNoUnknown;
    dogPreferredVetId: string;
  };
  const res = await dbQuery<Row>(dbPool, sql, [dogId]);
  const { dogEncryptedOii, ...otherFields } = res.rows[0];
  const { dogName } = await getDogMapper().mapDogSecureOiiToDogOii({
    dogEncryptedOii,
  });
  return { dogName, ...otherFields };
}
