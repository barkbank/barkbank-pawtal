import {
  dbDeleteDogVetPreferences,
  dbInsertDog,
  dbInsertDogVetPreference,
  dbSelectDog,
  dbSelectPreferredVetIds,
} from "@/lib/data/db-dogs";
import { dbInsertVet } from "@/lib/data/db-vets";
import { dbDeleteUser } from "@/lib/data/db-users";
import { withDb } from "../_db_helpers";
import { guaranteed } from "@/lib/bark-utils";
import { DogSpec } from "@/lib/data/db-models";
import { Pool } from "pg";
import {
  getDogMapper,
  getDogSpec,
  getVetSpec,
  insertUser
} from "../_fixtures";

describe("db-dogs", () => {
  describe("dbInsertDog", () => {
    it("should insert a new dog", async () => {
      await withDb(async (db) => {
        // Given a user
        const user = await insertUser(1, db);

        // When a dog is inserted for the user
        const dogSpec = await getDogSpec(1);
        const dogGen = await dbInsertDog(db, user.userId, dogSpec);

        // Then
        expect(dogGen.dogCreationTime).toBeTruthy();
        expect(dogGen.dogModificationTime).toBeTruthy();
        expect(dogGen.dogModificationTime).toEqual(dogGen.dogCreationTime);
      });
    });
    it("should permit null weight kg", async () => {
      await withDb(async (db) => {
        const user = await insertUser(8, db);
        const spec = await getDogSpec(7);
        spec.dogWeightKg = null;
        const dogGen = await dbInsertDog(db, user.userId, spec);

        // Verify that dog weight KG is null
        const dog = await dbSelectDog(db, dogGen.dogId);
        expect(dog).not.toBeNull();
        expect(dog?.dogWeightKg).toBeNull();
      });
    });
  });
  describe("dbInsertDog Data Validation", () => {
    const originalLogFn = console.error;
    beforeAll(() => {
      console.error = jest.fn();
    });
    afterAll(() => {
      console.error = originalLogFn;
    });
    async function expectErrorWhenInserting(
      spec: Record<string, any>,
      db: Pool,
    ) {
      const user = await insertUser(42, db);
      await expect(
        (async () => {
          await dbInsertDog(db, user.userId, spec as DogSpec);
        })(),
      ).rejects.toThrow(Error);
    }
    it("should not allow insertion of incorrect gender enum", async () => {
      await withDb(async (db) => {
        const spec: Record<string, any> = await getDogSpec(1);
        spec.dogGender = "F"; // Correct is 'FEMALE'
        await expectErrorWhenInserting(spec, db);
      });
    });
    it("should not allow insertion of incorrect antigen presence value", async () => {
      await withDb(async (db) => {
        const spec: Record<string, any> = await getDogSpec(1);
        spec.dogDea1Point1 = "+"; // Correct is 'POSITIVE'
        await expectErrorWhenInserting(spec, db);
      });
    });
    it("should not allow insertion of incorrect birthday format", async () => {
      await withDb(async (db) => {
        const spec: Record<string, any> = await getDogSpec(1);
        spec.dogBirthday = "2020-06"; // Correct should be padded like '2020-06-00'
        await expectErrorWhenInserting(spec, db);
      });
    });
    it("should not allow insertion of float weight", async () => {
      await withDb(async (db) => {
        const spec: Record<string, any> = await getDogSpec(1);
        spec.dogWeightKg = 17.5; // Cannot insert floats
        await expectErrorWhenInserting(spec, db);
      });
    });
    it("should not allow insertion of negative weight", async () => {
      // If weight is unknown, it should be null.
      await withDb(async (db) => {
        const spec: Record<string, any> = await getDogSpec(1);
        spec.dogWeightKg = -1;
        await expectErrorWhenInserting(spec, db);
      });
    });
    it("should not allow insertion of zero weight", async () => {
      // If weight is unknown, it should be null.
      await withDb(async (db) => {
        const spec: Record<string, any> = await getDogSpec(1);
        spec.dogWeightKg = 0;
        await expectErrorWhenInserting(spec, db);
      });
    });
  });
  describe("dbSelectDog", () => {
    it("should return the dog", async () => {
      await withDb(async (db) => {
        // Given a user with a dog
        const user = await insertUser(22, db);
        const specIn = await getDogSpec(1);
        const dogGen = await dbInsertDog(db, user.userId, specIn);

        // When the dog is selected by dogId
        const dog = await dbSelectDog(db, dogGen.dogId);

        // Then
        expect(dog).not.toBeNull();
        expect(dog?.dogCreationTime).toBeTruthy();
        expect(dog?.dogModificationTime).toBeTruthy();
        expect(dog?.dogModificationTime).toEqual(dog?.dogCreationTime);
        expect(dog?.userId).toBe(user.userId);
        const mapper = getDogMapper();
        const specOut = mapper.mapDogRecordToDogSpec(guaranteed(dog));
        expect(specOut).toMatchObject(specIn);
      });
    });
    it("should return null no dog matches the input dogId", async () => {
      await withDb(async (db) => {
        const dog = await dbSelectDog(db, "111");
        expect(dog).toBeNull();
      });
    });
  });
  describe("dbInsertDogVetPreference", () => {
    it("should insert a dog's vet preference", async () => {
      await withDb(async (db) => {
        const user = await insertUser(22, db);
        const dogGen = await dbInsertDog(db, user.userId, await getDogSpec(1));
        const vetGen = await dbInsertVet(db, getVetSpec(2));
        const inserted = await dbInsertDogVetPreference(
          db,
          dogGen.dogId,
          vetGen.vetId,
        );
        expect(inserted).toBe(true);
      });
    });
    it("should return false if dog-vet preference already exists", async () => {
      await withDb(async (db) => {
        const user = await insertUser(22, db);
        const dogGen = await dbInsertDog(db, user.userId, await getDogSpec(1));
        const vetGen = await dbInsertVet(db, getVetSpec(1));
        const firstInsertion = await dbInsertDogVetPreference(
          db,
          dogGen.dogId,
          vetGen.vetId,
        );
        expect(firstInsertion).toBe(true);
        const secondInsertion = await dbInsertDogVetPreference(
          db,
          dogGen.dogId,
          vetGen.vetId,
        );
        expect(secondInsertion).toBe(false);
      });
    });
    it("should return false if the dog has no user owner", async () => {
      await withDb(async (db) => {
        const user = await insertUser(22, db);
        const dogGen = await dbInsertDog(db, user.userId, await getDogSpec(1));
        const vetGen = await dbInsertVet(db, getVetSpec(1));
        const didDelete = await dbDeleteUser(db, user.userId);
        expect(didDelete).toBe(true);
        const didInsert = await dbInsertDogVetPreference(
          db,
          dogGen.dogId,
          vetGen.vetId,
        );
        expect(didInsert).toBe(false);
      });
    });
  });
  describe("dbSelectPreferredVetIds", () => {
    it("should return list of preferred vet IDs", async () => {
      await withDb(async (db) => {
        const user = await insertUser(22, db);
        const dogGen = await dbInsertDog(db, user.userId, await getDogSpec(1));
        const vetGen1 = await dbInsertVet(db, getVetSpec(1));
        const vetGen2 = await dbInsertVet(db, getVetSpec(2));
        await dbInsertDogVetPreference(db, dogGen.dogId, vetGen1.vetId);
        await dbInsertDogVetPreference(db, dogGen.dogId, vetGen2.vetId);
        const vetIds = await dbSelectPreferredVetIds(db, dogGen.dogId);
        expect(vetIds.includes(vetGen1.vetId)).toBe(true);
        expect(vetIds.includes(vetGen2.vetId)).toBe(true);
        expect(vetIds.length).toEqual(2);
      });
    });
  });
  describe("dbDeleteDogVetPreferences", () => {
    it("should delete dog vet preferences for the given dog", async () => {
      await withDb(async (db) => {
        const user = await insertUser(22, db);
        const dogGen = await dbInsertDog(db, user.userId, await getDogSpec(1));
        const vetGen1 = await dbInsertVet(db, getVetSpec(1));
        const vetGen2 = await dbInsertVet(db, getVetSpec(2));
        await dbInsertDogVetPreference(db, dogGen.dogId, vetGen1.vetId);
        await dbInsertDogVetPreference(db, dogGen.dogId, vetGen2.vetId);
        const numDeleted = await dbDeleteDogVetPreferences(db, dogGen.dogId);
        expect(numDeleted).toEqual(2);
        const vetIds = await dbSelectPreferredVetIds(db, dogGen.dogId);
        expect(vetIds.length).toEqual(0);
      });
    });
  });
});
