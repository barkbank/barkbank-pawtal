import { updateDogProfile } from "@/lib/user/actions/update-dog-profile";
import { withDb } from "../_db_helpers";
import {
  fetchDogInfo,
  getUserActor,
  insertCall,
  insertDog,
  insertReport,
  insertUser,
  insertVet,
} from "../_fixtures";
import { DogProfile } from "@/lib/dog/dog-models";
import { UTC_DATE_OPTION, parseDateTime } from "@/lib/utilities/bark-time";
import { CALL_OUTCOME, DOG_ANTIGEN_PRESENCE } from "@/lib/data/db-enums";
import { YES_NO_UNKNOWN } from "@/lib/bark/enums/yes-no";
import { DOG_GENDER } from "@/lib/bark/models/dog-gender";
import { dbInsertDogVetPreference } from "@/lib/data/db-dogs";

describe("updateDogProfile", () => {
  it("should return OK when update was successful", async () => {
    await withDb(async (dbPool) => {
      // GIVEN users u1 with dog d1 and preferred vet v1
      const u1 = await insertUser(1, dbPool);
      const d1 = await insertDog(1, u1.userId, dbPool);
      const v1 = await insertVet(1, dbPool);
      await dbInsertDogVetPreference(dbPool, d1.dogId, v1.vetId);
      const { profileModificationTime: profileModificationTimeBeforeUpdate } =
        await fetchDogInfo(dbPool, d1.dogId);

      // WHEN
      const v2 = await insertVet(2, dbPool);
      const actor1 = getUserActor(dbPool, u1.userId);
      const update = _getDogProfile({
        dogPreferredVetId: v2.vetId,
      });
      const res = await updateDogProfile(actor1, d1.dogId, update);

      // THEN
      expect(res).toEqual("OK");
      const { dogProfile, profileModificationTime } = await fetchDogInfo(
        dbPool,
        d1.dogId,
      );
      expect(dogProfile).toEqual(update);
      expect(profileModificationTime.getTime()).toBeGreaterThan(
        profileModificationTimeBeforeUpdate.getTime(),
      );
    });
  });
  it("should return ERROR_CANNOT_UPDATE_FULL_PROFILE when there is an existing report for the dog", async () => {
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
      const res = await updateDogProfile(actor1, d1.dogId, _getDogProfile());

      // THEN
      expect(res).toEqual("ERROR_CANNOT_UPDATE_FULL_PROFILE");
    });
  });
  it("should return ERROR_WRONG_OWNER when the user is not the dog owner", async () => {
    await withDb(async (dbPool) => {
      // GIVEN users u1 and u2
      const u1 = await insertUser(1, dbPool);
      const u2 = await insertUser(2, dbPool);

      // AND dog d2 belonging to u2
      const d2 = await insertDog(2, u2.userId, dbPool);

      // WHEN u1 attempts to update d2
      const actor1 = getUserActor(dbPool, u1.userId);
      const res = await updateDogProfile(actor1, d2.dogId, _getDogProfile());

      // THEN
      expect(res).toEqual("ERROR_WRONG_OWNER");
    });
  });
  it("should return ERROR_DOG_NOT_FOUND when the dog does not exist", async () => {
    await withDb(async (dbPool) => {
      // GIVEN users u1 with no dog
      const u1 = await insertUser(1, dbPool);

      // WHEN u1 attempts to update dog that does not exist
      const actor1 = getUserActor(dbPool, u1.userId);
      const nonExistentDogId = "123";
      const res = await updateDogProfile(
        actor1,
        nonExistentDogId,
        _getDogProfile(),
      );

      // THEN
      expect(res).toEqual("ERROR_DOG_NOT_FOUND");
    });
  });
});

function _getDogProfile(overrides?: Partial<DogProfile>): DogProfile {
  const base: DogProfile = {
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
