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

      // TODO: In _fixtures, impl givenUserActor(1, context), givenVetActor(1, context), givenAdminActor(1, context)
      // TODO: Replace insertUser, getUserActor with givenUserActor
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

      // TODO: Replace insertUser with givenUserActor
      // TODO: Replace insertDog with actor.addDogProfile

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
  it("can update dog profile", async () => {
    await withBarkContext(async ({ context }) => {
      const { dbPool } = context;

      // TODO: Replace insertUser with givenUserActor

      // Given actor
      const { userId } = await insertUser(1, dbPool);
      const actor = getUserActor(dbPool, userId);

      // With one dog
      const spec1 = mockDogProfileSpec({ dogName: "Rayden" });
      const resAdd = await actor.addDogProfile({ spec: spec1 });
      expect(resAdd.error).toBeUndefined();
      const { dogId } = resAdd.result!;

      // When the dog is updated
      const spec2 = mockDogProfileSpec({ dogName: "Raiden" });
      const resUpdate = await actor.updateDogProfile({ dogId, spec: spec2 });
      expect(resUpdate.error).toBeUndefined();

      // Then the dog should be updated
      const resGet = await actor.getDogProfile({ dogId });
      expect(resGet.error).toBeUndefined();
      const receivedSpec = DogProfileSpecSchema.parse(resGet.result);
      expect(receivedSpec).toMatchObject(spec2);
      expect(spec2).toMatchObject(receivedSpec);
    });
  });
  it("cannot update another user's dog", async () => {
    await withBarkContext(async ({ context }) => {
      const { dbPool } = context;

      // TODO: Replace insertUser with givenUserActor

      // Given a dog belonging to user 1
      const u1 = await insertUser(1, dbPool);
      const actor1 = getUserActor(dbPool, u1.userId);
      const spec1 = mockDogProfileSpec({ dogName: "Rayden" });
      const resAdd = await actor1.addDogProfile({ spec: spec1 });
      expect(resAdd.error).toBeUndefined();
      const d1 = resAdd.result!;

      // When another user 2 attempts to update the dog
      const u2 = await insertUser(2, dbPool);
      const actor2 = getUserActor(dbPool, u2.userId);
      const spec2 = mockDogProfileSpec({ dogName: "Raiden" });
      const resUpdate = await actor2.updateDogProfile({
        dogId: d1.dogId,
        spec: spec2,
      });

      // Then...
      expect(resUpdate.error).toEqual(CODE.ERROR_DOG_NOT_FOUND);
    });
  });
});
