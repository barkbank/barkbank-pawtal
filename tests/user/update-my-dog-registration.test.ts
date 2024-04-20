import { updateMyDogRegistration } from "@/lib/user/actions/update-my-dog-registration";
import { withDb } from "../_db_helpers";
import {
  getDecryptedText,
  getDogMapper,
  getUserActor,
  insertCall,
  insertDog,
  insertReport,
  insertUser,
  insertVet,
} from "../_fixtures";
import { MyDogRegistration } from "@/lib/user/user-models";
import { UTC_DATE_OPTION, parseDateTime } from "@/lib/utilities/bark-time";
import {
  CALL_OUTCOME,
  DOG_ANTIGEN_PRESENCE,
  DOG_GENDER,
  PARTICIPATION_STATUS,
  YES_NO_UNKNOWN,
} from "@/lib/data/db-enums";
import { dbInsertDogVetPreference } from "@/lib/data/db-dogs";
import { Pool, PoolClient } from "pg";
import { dbBegin, dbQuery, dbRelease } from "@/lib/data/db-utils";
import { MILLIS_PER_WEEK } from "@/lib/utilities/bark-millis";

// WIP: Fix these broken tests first, then fix the impl. (!!!)
describe("updateMyDogRegistration", () => {
  it("should return OK_UPDATED when update was successful", async () => {
    await withDb(async (dbPool) => {
      // GIVEN users u1 with dog d1 and preferred vet v1
      const u1 = await insertUser(1, dbPool);
      const d1 = await insertDog(1, u1.userId, dbPool);
      const v1 = await insertVet(1, dbPool);
      await dbInsertDogVetPreference(dbPool, d1.dogId, v1.vetId);

      // WHEN
      const v2 = await insertVet(2, dbPool);
      const actor1 = getUserActor(dbPool, u1.userId);
      const update = registrationUpdate(d1.dogId, {
        dogPreferredVetId: v2.vetId,
      });
      const res = await updateMyDogRegistration(actor1, update);

      // THEN
      expect(res).toEqual("OK_UPDATED");
      const dataInDb = await reconstructUpdateFromDb(dbPool, d1.dogId);
      expect(dataInDb).toEqual(update);
    });
  });
  it("should encrypt and store non-participation reason", async () => {
    await withDb(async (dbPool) => {
      // GIVEN users u1 with dog d1 and preferred vet v1
      const u1 = await insertUser(1, dbPool);
      const d1 = await insertDog(1, u1.userId, dbPool);
      const v1 = await insertVet(1, dbPool);
      await dbInsertDogVetPreference(dbPool, d1.dogId, v1.vetId);

      // WHEN
      const actor1 = getUserActor(dbPool, u1.userId);
      const update = registrationUpdate(d1.dogId, {
        dogParticipationStatus: PARTICIPATION_STATUS.PAUSED,
        dogPauseExpiryTime: new Date(Date.now() + MILLIS_PER_WEEK),
        dogNonParticipationReason: "some reason 123",
      });
      const res = await updateMyDogRegistration(actor1, update);

      // THEN
      expect(res).toEqual("OK_UPDATED");
      const queryResult = await dbQuery(
        dbPool,
        `
        select dog_encrypted_reason as "dogEncryptedReason"
        from dogs
        where dog_id = $1
        `,
        [d1.dogId],
      );
      const { dogEncryptedReason } = queryResult.rows[0];
      expect(dogEncryptedReason).not.toEqual("some reason 123");
      expect(dogEncryptedReason).not.toEqual("");
      const dogNonParticipationReason =
        await getDecryptedText(dogEncryptedReason);
      expect(dogNonParticipationReason).toEqual("some reason 123");
    });
  });
  it("should return ERROR_REPORT_EXISTS when there is an existing report for the dog", async () => {
    await withDb(async (dbPool) => {
      // GIVEN users u1 with dog d1 with report
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
      const actor1 = getUserActor(dbPool, u1.userId);
      const res = await updateMyDogRegistration(
        actor1,
        registrationUpdate(d1.dogId),
      );

      // THEN
      expect(res).toEqual("ERROR_REPORT_EXISTS");
    });
  });
  it("should return ERROR_UNAUTHORIZED when the user is not the dog owner", async () => {
    await withDb(async (dbPool) => {
      // GIVEN users u1 and u2
      const u1 = await insertUser(1, dbPool);
      const u2 = await insertUser(2, dbPool);

      // AND dog d2 belonging to u2
      const d2 = await insertDog(2, u2.userId, dbPool);

      // WHEN u1 attempts to update d2
      const actor1 = getUserActor(dbPool, u1.userId);
      const res = await updateMyDogRegistration(
        actor1,
        registrationUpdate(d2.dogId),
      );

      // THEN
      expect(res).toEqual("ERROR_UNAUTHORIZED");
    });
  });
  it("should return ERROR_MISSING_DOG when the dog does not exist", async () => {
    await withDb(async (dbPool) => {
      // GIVEN users u1 with no dog
      const u1 = await insertUser(1, dbPool);

      // WHEN u1 attempts to update dog that does not exist
      const actor1 = getUserActor(dbPool, u1.userId);
      const res = await updateMyDogRegistration(
        actor1,
        registrationUpdate("123"),
      );

      // THEN
      expect(res).toEqual("ERROR_MISSING_DOG");
    });
  });
});

function registrationUpdate(
  overrides?: Partial<MyDogRegistration>,
): MyDogRegistration {
  const base: MyDogRegistration = {
    dogName: "updated name",
    dogBreed: "updated breed",
    dogBirthday: parseDateTime("1970-01-01", UTC_DATE_OPTION),
    dogGender: DOG_GENDER.MALE,
    dogWeightKg: 50,
    dogDea1Point1: DOG_ANTIGEN_PRESENCE.UNKNOWN,
    dogEverPregnant: YES_NO_UNKNOWN.NO,
    dogEverReceivedTransfusion: YES_NO_UNKNOWN.NO,
    dogPreferredVetId: "",
  };
  return { ...base, ...overrides };
}

async function reconstructUpdateFromDb(
  dbPool: Pool,
  dogId: string,
): Promise<Partial<MyDogRegistration>> {
  const conn = await dbPool.connect();
  try {
    await dbBegin(conn);
    const namePart = await fetchDogName(conn, dogId);
    const fieldsPart = await fetchDogFields(conn, dogId);
    const vetPart = await fetchDogPreferredVetId(conn, dogId);
    return { ...namePart, ...fieldsPart, ...vetPart };
  } finally {
    await dbRelease(conn);
  }
}

async function fetchDogName(
  conn: PoolClient,
  dogId: string,
): Promise<Partial<MyDogRegistration>> {
  const sql = `
  select
    dog_encrypted_oii as "dogEncryptedOii"
  from dogs
  where dog_id = $1
  `;
  const res = await dbQuery(conn, sql, [dogId]);
  const { dogEncryptedOii } = res.rows[0];
  const { dogName } = await getDogMapper().mapDogSecureOiiToDogOii({
    dogEncryptedOii,
  });
  return { dogName };
}

async function fetchDogFields(
  conn: PoolClient,
  dogId: string,
): Promise<Partial<MyDogRegistration>> {
  const sql = `
  select
    dog_id as "dogId",
    dog_breed as "dogBreed",
    dog_birthday as "dogBirthday",
    dog_gender as "dogGender",
    dog_weight_kg as "dogWeightKg",
    dog_dea1_point1 as "dogDea1Point1",
    dog_ever_pregnant as "dogEverPregnant",
    dog_ever_received_transfusion as "dogEverReceivedTransfusion",
    dog_participation_status as "dogParticipationStatus",
    dog_encrypted_reason as "dogEncryptedReason",
    dog_pause_expiry_time as "dogPauseExpiryTime"
  from dogs
  where dog_id = $1
  `;
  const res = await dbQuery(conn, sql, [dogId]);
  const { dogEncryptedReason, ...otherFields } = res.rows[0];
  const dogNonParticipationReason =
    dogEncryptedReason === "" ? "" : await getDecryptedText(dogEncryptedReason);
  return { dogNonParticipationReason, ...otherFields };
}

async function fetchDogPreferredVetId(
  conn: PoolClient,
  dogId: string,
): Promise<Partial<MyDogRegistration>> {
  const sql = `
  select vet_id as "dogPreferredVetId"
  from dog_vet_preferences
  where dog_id = $1
  `;
  const res = await dbQuery(conn, sql, [dogId]);
  if (res.rows.length === 0) {
    return { dogPreferredVetId: "" };
  }
  if (res.rows.length > 1) {
    return { dogPreferredVetId: "MORE_THAN_ONE" };
  }
  const { dogPreferredVetId } = res.rows[0];
  return { dogPreferredVetId };
}
