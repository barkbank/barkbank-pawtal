import { DogProfileSpecSchema } from "@/lib/bark/models/dog-profile-models";
import {
  getUserActor,
  insertDog,
  insertUser,
  mockDogProfileSpec,
} from "../_fixtures";
import { withBarkContext } from "../bark/_context";
import { CODE } from "@/lib/utilities/bark-code";

describe("UserActor", () => {
  it("can add and get dog", async () => {
    await withBarkContext(async ({ context }) => {
      const { dbPool } = context;
      const { userId } = await insertUser(1, dbPool);
      const actor = getUserActor(dbPool, userId);
      const spec = mockDogProfileSpec();
      const resAdd = await actor.addDogProfile({ spec });
      expect(resAdd.error).toBeUndefined();
      const { dogId } = resAdd.result!;
      const resGet = await actor.getDogProfile({ dogId });
      expect(resGet.error).toBeUndefined();
      const receivedSpec = DogProfileSpecSchema.parse(resGet.result);
      expect(receivedSpec).toMatchObject(spec);
      expect(spec).toMatchObject(receivedSpec);
    });
  });
  it("cannot get other user's dog profile", async () => {
    await withBarkContext(async ({ context }) => {
      const { dbPool } = context;

      // Given u1 owns d1
      const u1 = await insertUser(1, dbPool);
      const d1 = await insertDog(1, u1.userId, dbPool);

      // When u2 tries to get d1
      const u2 = await insertUser(2, dbPool);
      const actor = getUserActor(dbPool, u2.userId);
      const resGet = await actor.getDogProfile({ dogId: d1.dogId });

      // Then
      expect(resGet.error).toEqual(CODE.ERROR_DOG_NOT_FOUND);
    });
  });
});
