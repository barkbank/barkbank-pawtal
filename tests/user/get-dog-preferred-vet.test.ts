import { getDogPreferredVet } from "@/lib/user/actions/get-dog-preferred-vet";
import { withDb } from "../_db_helpers";
import { getUserActor, insertDog, insertUser, insertVet } from "../_fixtures";
import { CODE } from "@/lib/utilities/bark-code";
import { dbInsertDogVetPreference } from "@/lib/data/db-dogs";
import { DogPreferredVet } from "@/lib/bark/models/dog-preferred-vet";

describe("getDogPreferredVet", () => {
  it("should return ERROR_DOG_NOT_FOUND when dog cannot be found", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const unknownDogId = "12345";
      const actor = getUserActor(dbPool, u1.userId);
      const { result, error } = await getDogPreferredVet(actor, unknownDogId);
      expect(error).toEqual(CODE.ERROR_DOG_NOT_FOUND);
      expect(result).toBeUndefined();
    });
  });
  it("should return ERROR_WRONG_OWNER if the user does not own the dog", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const owner = await insertUser(2, dbPool);
      const d1 = await insertDog(1, owner.userId, dbPool);
      const actor = getUserActor(dbPool, u1.userId);
      const { result, error } = await getDogPreferredVet(actor, d1.dogId);
      expect(error).toEqual(CODE.ERROR_WRONG_OWNER);
      expect(result).toBeUndefined();
    });
  });
  it("should return null when dog has no preferred vet", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const d1 = await insertDog(1, u1.userId, dbPool);
      const actor = getUserActor(dbPool, u1.userId);
      const { result, error } = await getDogPreferredVet(actor, d1.dogId);
      expect(error).toBeUndefined();
      expect(result).toBeNull();
    });
  });
  it("should return ERROR_MORE_THAN_ONE_PREFERRED_VET when dog has more than one preferred vet", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const d1 = await insertDog(1, u1.userId, dbPool);
      const v1 = await insertVet(1, dbPool);
      const v2 = await insertVet(2, dbPool);
      await dbInsertDogVetPreference(dbPool, d1.dogId, v1.vetId);
      await dbInsertDogVetPreference(dbPool, d1.dogId, v2.vetId);
      const actor = getUserActor(dbPool, u1.userId);
      const { result, error } = await getDogPreferredVet(actor, d1.dogId);
      expect(error).toEqual(CODE.ERROR_MORE_THAN_ONE_PREFERRED_VET);
      expect(result).toBeUndefined();
    });
  });
  it("should return preferred vet when dog has one preferred vet", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const d1 = await insertDog(1, u1.userId, dbPool);
      const v2 = await insertVet(2, dbPool);
      await dbInsertDogVetPreference(dbPool, d1.dogId, v2.vetId);
      const actor = getUserActor(dbPool, u1.userId);
      const { result, error } = await getDogPreferredVet(actor, d1.dogId);
      const { dogId } = d1;
      const { vetId, vetEmail, vetName, vetPhoneNumber, vetAddress } = v2;
      const expected: DogPreferredVet = {
        dogId,
        vetId,
        vetEmail,
        vetName,
        vetPhoneNumber,
        vetAddress,
      };
      expect(error).toBeUndefined();
      expect(result).toEqual(expected);
    });
  });
});
