import { getMyDogDetails } from "@/lib/user/actions/get-my-dog-details";
import { withDb } from "../_db_helpers";
import {
  getDogOii,
  getDogSpec,
  getUserActor,
  getVetSpec,
  insertCall,
  insertDog,
  insertReport,
  insertUser,
  insertVet,
} from "../_fixtures";
import {
  dbInsertDogVetPreference,
  dbUpdateDogParticipation,
} from "@/lib/data/db-dogs";
import {
  CALL_OUTCOME,
  DogAntigenPresence,
  PARTICIPATION_STATUS,
  POS_NEG_NIL,
} from "@/lib/data/db-enums";
import {
  DEFAULT_DATE_TIME_FORMAT,
  SINGAPORE_TIME_ZONE,
  parseDateTime,
} from "@/lib/utilities/bark-time";
import { MILLIS_PER_WEEK } from "@/lib/utilities/bark-millis";

describe("getMyDogDetails", () => {
  it("should return null when user does not own the dog requested", async () => {
    await withDb(async (dbPool) => {
      // Given that user1 owns dog1
      const { userId: userId1 } = await insertUser(1, dbPool);
      const { dogId: dogId1 } = await insertDog(2, userId1, dbPool);

      // When user2 requests for details pertaining to dog1
      const { userId: userId2 } = await insertUser(2, dbPool);
      const actor2 = getUserActor(dbPool, userId2);
      const dogDetails = await getMyDogDetails(actor2, dogId1);

      // Then null should be returned
      expect(dogDetails).toBeNull();
    });
  });
  it("should return dog details when user owns the dog requested", async () => {
    await withDb(async (dbPool) => {
      // Given that u1 owns dog d1
      const u1 = await insertUser(1, dbPool);
      const d1 = await insertDog(1, u1.userId, dbPool);

      // and the preferred vet is v1
      const v1 = await insertVet(1, dbPool);
      await dbInsertDogVetPreference(dbPool, d1.dogId, v1.vetId);

      // and participation is paused for two weeks.
      const pauseExpiryTime = new Date(Date.now() + 2 * MILLIS_PER_WEEK);
      await dbUpdateDogParticipation(
        dbPool,
        d1.dogId,
        PARTICIPATION_STATUS.PAUSED,
        pauseExpiryTime,
      );

      // When user1 requests for details pertaining to dog1
      const actor = getUserActor(dbPool, u1.userId);
      const dogDetails = await getMyDogDetails(actor, d1.dogId);

      // Then dog details should be returned
      const spec = await getDogSpec(1);
      const oii = await getDogOii(1);
      expect(dogDetails).toEqual({
        dogId: d1.dogId,

        serviceStatus: "AVAILABLE",
        profileStatus: "COMPLETE",
        medicalStatus: "TEMPORARILY_INELIGIBLE",
        participationStatus: "PAUSED",
        numPendingReports: 0,

        dogName: oii.dogName,
        dogBreed: spec.dogBreed,
        dogBirthday: spec.dogBirthday,
        dogGender: spec.dogGender,
        dogWeightKg: spec.dogWeightKg,
        dogDea1Point1: spec.dogDea1Point1,
        dogEverPregnant: spec.dogEverPregnant,
        dogEverReceivedTransfusion: spec.dogEverReceivedTransfusion,

        dogPreferredVetId: v1.vetId,
        dogParticipationStatus: "PAUSED",
        dogPauseExpiryTime: pauseExpiryTime,

        dogReports: [],
      });
    });
  });
  it("should return number of pending reports", async () => {
    await withDb(async (dbPool) => {
      // GIVEN
      const { userId } = await insertUser(6, dbPool);
      const { dogId } = await insertDog(7, userId, dbPool);
      const { vetId } = await insertVet(8, dbPool);
      await dbInsertDogVetPreference(dbPool, dogId, vetId);
      const { callId } = await insertCall(
        dbPool,
        dogId,
        vetId,
        CALL_OUTCOME.APPOINTMENT,
      );

      // WHEN
      const actor = getUserActor(dbPool, userId);
      const details = await getMyDogDetails(actor, dogId);

      // THEN
      expect(details?.numPendingReports).toEqual(1);
    });
  });
  it("should return summary information of medical reports received", async () => {
    await withDb(async (dbPool) => {
      // GIVEN
      const { userId } = await insertUser(6, dbPool);
      const { dogId } = await insertDog(7, userId, dbPool);
      const { vetId } = await insertVet(8, dbPool);
      await dbInsertDogVetPreference(dbPool, dogId, vetId);
      const { callId } = await insertCall(
        dbPool,
        dogId,
        vetId,
        CALL_OUTCOME.APPOINTMENT,
      );
      const visitTime = parseDateTime("2023-04-01 15:30", {
        format: DEFAULT_DATE_TIME_FORMAT,
        timeZone: SINGAPORE_TIME_ZONE,
      });
      const { reportId } = await insertReport(dbPool, callId, { visitTime });

      // WHEN
      const actor = getUserActor(dbPool, userId);
      const details = await getMyDogDetails(actor, dogId);

      // THEN
      expect(details?.numPendingReports).toEqual(0);
      expect(details?.dogReports[0].reportId).toEqual(reportId);
      expect(details?.dogReports[0].visitTime).toEqual(visitTime);
      expect(details?.dogReports[0].vetId).toEqual(vetId);
      expect(details?.dogReports[0].vetName).toEqual(getVetSpec(8).vetName);
    });
  });
  it("should use the latest values available", async () => {
    await withDb(async (dbPool) => {
      // GIVEN
      const { userId } = await insertUser(6, dbPool);
      const { dogId } = await insertDog(7, userId, dbPool, {
        dogWeightKg: 20,
        dogDea1Point1: DogAntigenPresence.UNKNOWN,
      });
      const { vetId } = await insertVet(8, dbPool);
      await dbInsertDogVetPreference(dbPool, dogId, vetId);
      const { callId } = await insertCall(
        dbPool,
        dogId,
        vetId,
        CALL_OUTCOME.APPOINTMENT,
      );
      const { reportId } = await insertReport(dbPool, callId, {
        dogWeightKg: 25,
        dogDea1Point1: POS_NEG_NIL.POSITIVE,
      });

      // WHEN
      const actor = getUserActor(dbPool, userId);
      const details = await getMyDogDetails(actor, dogId);

      // THEN
      expect(details?.dogWeightKg).toEqual(25);
      expect(details?.dogDea1Point1).toEqual(DogAntigenPresence.POSITIVE);
    });
  });
});
