import { getMyDogDetails } from "@/lib/user/actions/get-my-dog-details";
import { withDb } from "../_db_helpers";
import {
  getDogOii,
  getDogSpec,
  getUserActor,
  insertDog,
  insertUser,
} from "../_fixtures";
import { dbQuery } from "@/lib/data/db-utils";

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
      // Given that user1 owns dog1
      const { userId: userId1 } = await insertUser(1, dbPool);
      const { dogId: dogId1 } = await insertDog(1, userId1, dbPool);

      // When user1 requests for details pertaining to dog1
      const actor1 = getUserActor(dbPool, userId1);
      const dogDetails = await getMyDogDetails(actor1, dogId1);

      // Then dog details should be returned
      const spec = await getDogSpec(1);
      const oii = await getDogOii(1);
      expect(dogDetails).toEqual({
        dogId: dogId1,

        serviceStatus: "AVAILABLE",
        profileStatus: "COMPLETE",
        medicalStatus: "TEMPORARILY_INELIGIBLE",
        participationStatus: "PARTICIPATING",
        numPendingReports: 0,

        dogName: oii.dogName,
        dogBreed: spec.dogBreed,
        dogBirthday: spec.dogBirthday,
        dogGender: spec.dogGender,
        dogWeightKg: spec.dogWeightKg,
        dogDea1Point1: spec.dogDea1Point1,
        dogEverPregnant: spec.dogEverPregnant,
        dogEverReceivedTransfusion: spec.dogEverReceivedTransfusion,

        dogReports: [],
      });
    });
  });
});
