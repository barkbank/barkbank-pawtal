import { SubProfile } from "@/lib/dog/dog-models";
import { withDb } from "../_db_helpers";
import { CALL_OUTCOME } from "@/lib/data/db-enums";
import { YES_NO_UNKNOWN } from "@/lib/bark/enums/yes-no";
import {
  fetchDogInfo,
  getUserActor,
  insertCall,
  insertDog,
  insertReport,
  insertUser,
  insertVet,
} from "../_fixtures";
import { updateSubProfile } from "@/lib/user/actions/update-sub-profile";
import { dbInsertDogVetPreference } from "@/lib/data/db-dogs";

describe("updateSubProfile", () => {
  it("should return OK when successfully updated dog details", async () => {
    await withDb(async (dbPool) => {
      // GIVEN users u1 with dog d1 and preferred vet v1
      const u1 = await insertUser(1, dbPool);
      const d1 = await insertDog(1, u1.userId, dbPool, { dogWeightKg: 30 });
      const v1 = await insertVet(1, dbPool);
      await dbInsertDogVetPreference(dbPool, d1.dogId, v1.vetId);
      const c1 = await insertCall(
        dbPool,
        d1.dogId,
        v1.vetId,
        CALL_OUTCOME.APPOINTMENT,
      );
      const r1 = await insertReport(dbPool, c1.callId, { dogWeightKg: 31 });
      const { profileModificationTime: profileModificationTimeBeforeUpdate } =
        await fetchDogInfo(dbPool, d1.dogId);

      // WHEN
      const v2 = await insertVet(2, dbPool);
      const actor1 = getUserActor(dbPool, u1.userId);
      const update = _getSubProfile({
        dogPreferredVetId: v2.vetId,
        dogWeightKg: 32,
      });
      const res = await updateSubProfile(actor1, d1.dogId, update);

      // THEN
      expect(res).toEqual("OK");
      const { subProfile, profileModificationTime } = await fetchDogInfo(
        dbPool,
        d1.dogId,
      );
      expect(subProfile).toEqual(update);
      expect(profileModificationTime.getTime()).toBeGreaterThan(
        profileModificationTimeBeforeUpdate.getTime(),
      );
    });
  });
  it("should return ERROR_WRONG_OWNER when user does not own the dog", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const d1 = await insertDog(1, u1.userId, dbPool);

      // WHEN u2 tries to update u1's dog
      const u2 = await insertUser(2, dbPool);
      const update = _getSubProfile();
      const actor = getUserActor(dbPool, u2.userId);
      const res = await updateSubProfile(actor, d1.dogId, update);
      expect(res).toEqual("ERROR_WRONG_OWNER");
    });
  });
  it("should return ERROR_SHOULD_UPDATE_FULL_PROFILE when dog does not have an existing report", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const d1 = await insertDog(1, u1.userId, dbPool);
      const update = _getSubProfile();
      const actor = getUserActor(dbPool, u1.userId);
      const res = await updateSubProfile(actor, d1.dogId, update);
      expect(res).toEqual("ERROR_SHOULD_UPDATE_FULL_PROFILE");
    });
  });
  it("should return ERROR_DOG_NOT_FOUND dog not found", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const unknownDogId = "123";
      const update = _getSubProfile();
      const actor = getUserActor(dbPool, u1.userId);
      const res = await updateSubProfile(actor, unknownDogId, update);
      expect(res).toEqual("ERROR_DOG_NOT_FOUND");
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
