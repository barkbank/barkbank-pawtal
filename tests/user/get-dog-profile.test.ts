import { getDogProfile } from "@/lib/user/actions/get-dog-profile";
import { withDb } from "../_db_helpers";
import {
  getDogOii,
  getDogSpec,
  getUserActor,
  insertCall,
  insertDog,
  insertReport,
  insertUser,
  insertVet,
} from "../_fixtures";
import { dbInsertDogVetPreference } from "@/lib/data/db-dogs";
import {
  CALL_OUTCOME,
  DOG_ANTIGEN_PRESENCE,
  POS_NEG_NIL,
} from "@/lib/data/db-enums";

describe("getDogProfile", () => {
  it("should return ERROR_UNAUTHORIZED when user does not own the dog requested", async () => {
    await withDb(async (dbPool) => {
      // Given user u1 owns d1
      const u1 = await insertUser(1, dbPool);
      const d1 = await insertDog(2, u1.userId, dbPool);

      // When u2 requests for details pertaining to d1
      const u2 = await insertUser(2, dbPool);
      const u2Actor = getUserActor(dbPool, u2.userId);
      const { result, error } = await getDogProfile(u2Actor, d1.dogId);

      // Then
      expect(error).toEqual("ERROR_UNAUTHORIZED");
      expect(result).toBeUndefined();
    });
  });
  it("should return ERROR_MISSING_DOG when dog does not exist", async () => {
    await withDb(async (dbPool) => {
      // Given u1
      const u1 = await insertUser(1, dbPool);

      // When u1 requests for dog that does not exists
      const actor = getUserActor(dbPool, u1.userId);
      const noSuchDogId = "87654";
      const { result, error } = await getDogProfile(actor, noSuchDogId);

      // Then
      expect(error).toEqual("ERROR_MISSING_DOG");
      expect(result).toBeUndefined();
    });
  });
  it("should return dog profile when user owns the dog requested", async () => {
    await withDb(async (dbPool) => {
      // Given that u1 owns dog d1
      const u1 = await insertUser(1, dbPool);
      const d1 = await insertDog(1, u1.userId, dbPool);

      // and the preferred vet is v1
      const v1 = await insertVet(1, dbPool);
      await dbInsertDogVetPreference(dbPool, d1.dogId, v1.vetId);

      // When user1 requests for details pertaining to dog1
      const actor = getUserActor(dbPool, u1.userId);
      const { result, error } = await getDogProfile(actor, d1.dogId);

      // Then dog details should be returned
      const spec = await getDogSpec(1);
      const oii = await getDogOii(1);
      expect(error).toBeUndefined();
      expect(result).toEqual({
        dogName: oii.dogName,
        dogBreed: spec.dogBreed,
        dogBirthday: spec.dogBirthday,
        dogGender: spec.dogGender,
        dogWeightKg: spec.dogWeightKg,
        dogDea1Point1: spec.dogDea1Point1,
        dogEverPregnant: spec.dogEverPregnant,
        dogEverReceivedTransfusion: spec.dogEverReceivedTransfusion,
        dogPreferredVetId: v1.vetId,
      });
    });
  });
  it("should use the latest values available for weight and blood type", async () => {
    await withDb(async (dbPool) => {
      // GIVEN
      const { userId } = await insertUser(6, dbPool);
      const { dogId } = await insertDog(7, userId, dbPool, {
        dogWeightKg: 20,
        dogDea1Point1: DOG_ANTIGEN_PRESENCE.UNKNOWN,
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
      const { result, error } = await getDogProfile(actor, dogId);

      // THEN
      expect(error).toBeUndefined();
      expect(result?.dogWeightKg).toEqual(25);
      expect(result?.dogDea1Point1).toEqual(DOG_ANTIGEN_PRESENCE.POSITIVE);
    });
  });
});
