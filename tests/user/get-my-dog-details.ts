import { getMyDogDetails } from "@/lib/user/actions/get-my-dog-details";
import { withDb } from "../_db_helpers";
import { getUserActor, insertDog, insertUser } from "../_fixtures";

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
});
