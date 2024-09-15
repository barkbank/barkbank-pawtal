import {
  givenUserActor,
  givenVetActor,
  mockDogProfileSpec,
} from "../_fixtures";
import { CODE } from "@/lib/utilities/bark-code";
import {
  DogPreferredVet,
  DogPreferredVetSchema,
} from "@/lib/bark/models/dog-preferred-vet";
import { withBarkContext } from "../bark/_context";
import { VetPreferenceDao } from "@/lib/bark/daos/vet-preference-dao";

describe("UserActor::getDogPreferredVet", () => {
  it("should return ERROR_DOG_NOT_FOUND when dog cannot be found", async () => {
    await withBarkContext(async ({ context }) => {
      const u1 = await givenUserActor({ idx: 1, context });
      const unknownDogId = "12345";
      const { result, error } = await u1.getDogPreferredVet({
        dogId: unknownDogId,
      });
      expect(error).toEqual(CODE.ERROR_DOG_NOT_FOUND);
      expect(result).toBeUndefined();
    });
  });
  it("should return ERROR_DOG_NOT_FOUND if the user does not own the dog", async () => {
    await withBarkContext(async ({ context }) => {
      const owner = await givenUserActor({ idx: 99, context });
      const spec = mockDogProfileSpec();
      const dog = (await owner.addDogProfile({ spec })).result!;
      const actor = await givenUserActor({ idx: 1, context });
      const { result, error } = await actor.getDogPreferredVet({
        dogId: dog.dogId,
      });
      expect(error).toEqual(CODE.ERROR_DOG_NOT_FOUND);
      expect(result).toBeUndefined();
    });
  });
  it("should return null when dog has no preferred vet", async () => {
    await withBarkContext(async ({ context }) => {
      const owner = await givenUserActor({ idx: 99, context });
      const spec = mockDogProfileSpec({
        dogPreferredVetId: "",
      });
      const dog = (await owner.addDogProfile({ spec })).result!;
      const { result, error } = await owner.getDogPreferredVet({
        dogId: dog.dogId,
      });
      expect(error).toBeUndefined();
      expect(result).toBeNull();
    });
  });
  it("should return ERROR_MORE_THAN_ONE_PREFERRED_VET when dog has more than one preferred vet", async () => {
    await withBarkContext(async ({ context }) => {
      // Given two vets
      const v1 = await givenVetActor({ idx: 1, context });
      const v2 = await givenVetActor({ idx: 2, context });

      // And owner u1 with dog d1 preferring v1
      const u1 = await givenUserActor({ idx: 1, context });
      const spec = mockDogProfileSpec({
        dogPreferredVetId: v1.getVetId(),
      });
      const d1 = (await u1.addDogProfile({ spec })).result!;

      // And we force inject an error, a preference for v2 also.
      const dao = new VetPreferenceDao(context.dbPool);
      await dao.insert({
        pref: {
          userId: u1.getUserId(),
          dogId: d1.dogId,
          vetId: v2.getVetId(),
        },
      });

      // When u1 gets dog preference
      const { result, error } = await u1.getDogPreferredVet({
        dogId: d1.dogId,
      });
      expect(error).toEqual(CODE.ERROR_MORE_THAN_ONE_PREFERRED_VET);
      expect(result).toBeUndefined();
    });
  });
  it("should return preferred vet when dog has one preferred vet", async () => {
    await withBarkContext(async ({ context }) => {
      const v1 = await givenVetActor({ idx: 1, context });
      const u1 = await givenUserActor({ idx: 1, context });
      const spec = mockDogProfileSpec({
        dogPreferredVetId: v1.getVetId(),
      });
      const d1 = (await u1.addDogProfile({ spec })).result!;
      const { result, error } = await u1.getDogPreferredVet({
        dogId: d1.dogId,
      });
      const data: DogPreferredVet = {
        dogId: d1.dogId,
        ...v1.getVetClinic(),
      };
      const expected = DogPreferredVetSchema.parse(data);
      expect(error).toBeUndefined();
      expect(result).toEqual(expected);
    });
  });
});
