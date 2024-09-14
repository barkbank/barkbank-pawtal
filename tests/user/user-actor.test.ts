import { DogProfileSpecSchema } from "@/lib/bark/models/dog-profile-models";
import { givenUserActor, mockDogProfileSpec } from "../_fixtures";
import { withBarkContext } from "../bark/_context";
import { CODE } from "@/lib/utilities/bark-code";

describe("UserActor", () => {
  it("can add and get dog", async () => {
    await withBarkContext(async ({ context }) => {
      const u1 = await givenUserActor({ idx: 1, context });
      const spec = mockDogProfileSpec();
      const resAdd = await u1.addDogProfile({ spec });
      expect(resAdd.error).toBeUndefined();
      const { dogId } = resAdd.result!;
      const resGet = await u1.getDogProfile({ dogId });
      expect(resGet.error).toBeUndefined();
      const receivedSpec = DogProfileSpecSchema.parse(resGet.result);
      expect(receivedSpec).toMatchObject(spec);
      expect(spec).toMatchObject(receivedSpec);
    });
  });
  it("cannot get other user's dog profile", async () => {
    await withBarkContext(async ({ context }) => {
      // Given u1 owns d1
      const u1 = await givenUserActor({ idx: 1, context });
      const spec = mockDogProfileSpec();
      const d1 = (await u1.addDogProfile({ spec })).result!;

      // When u2 tries to get d1
      const u2 = await givenUserActor({ idx: 2, context });
      const resGet = await u2.getDogProfile({ dogId: d1.dogId });

      // Then
      expect(resGet.error).toEqual(CODE.ERROR_DOG_NOT_FOUND);
    });
  });
  it("can update dog profile", async () => {
    await withBarkContext(async ({ context }) => {
      const { dbPool } = context;

      // Given actor
      const actor = await givenUserActor({ idx: 1, context });

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
      // Given a dog belonging to user 1
      const u1 = await givenUserActor({ idx: 1, context });
      const spec1 = mockDogProfileSpec({ dogName: "Rayden" });
      const resAdd = await u1.addDogProfile({ spec: spec1 });
      expect(resAdd.error).toBeUndefined();
      const d1 = resAdd.result!;

      // When another user 2 attempts to update the dog
      const u2 = await givenUserActor({ idx: 2, context });
      const spec2 = mockDogProfileSpec({ dogName: "Raiden" });
      const resUpdate = await u2.updateDogProfile({
        dogId: d1.dogId,
        spec: spec2,
      });

      // Then...
      expect(resUpdate.error).toEqual(CODE.ERROR_DOG_NOT_FOUND);
    });
  });
});
