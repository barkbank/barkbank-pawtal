import { MyDogDetailsUpdate } from "@/lib/user/user-models";
import { withDb } from "../_db_helpers";
import { PARTICIPATION_STATUS, YesNoUnknown } from "@/lib/data/db-enums";
import { getUserActor, insertDog, insertUser } from "../_fixtures";
import { updateMyDogDetails } from "@/lib/user/actions/update-my-dog-details";

describe("updateMyDogDetails", () => {
  it("should return OK_UPDATED when successfully updated dog details", async () => {
    await withDb(async (dbPool) => {});
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
    await withDb(async (dbPool) => {});
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
