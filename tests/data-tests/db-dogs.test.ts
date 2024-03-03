import {
  dbDeleteDogVetPreferences,
  dbInsertDog,
  dbInsertDogVetPreference,
  dbSelectDog,
  dbSelectPreferredVetIds,
} from "@/lib/data/db-dogs";
import { dbInsertVet } from "@/lib/data/db-vets";
import { dogSpec, userSpec, vetSpec } from "./_db_fixtures";
import { dbDeleteUser, dbInsertUser } from "@/lib/data/db-users";
import { withDb } from "../_db_helpers";
import { toDogSpec } from "@/lib/data/db-mappers";
import { guaranteed } from "@/lib/bark-utils";
import { DogSpec } from "@/lib/data/db-models";
import { Pool } from "pg";

describe("db-dogs", () => {
  describe("dbInsertDog", () => {
    it("should insert a new dog", async () => {
      await withDb(async (db) => {
        // Given a user
        const userGen = await dbInsertUser(db, userSpec(1));

        // When a dog is inserted for the user
        const dogGen = await dbInsertDog(db, userGen.userId, dogSpec(1));

        // Then
        expect(dogGen.dogCreationTime).toBeTruthy();
        expect(dogGen.dogModificationTime).toBeTruthy();
        expect(dogGen.dogModificationTime).toEqual(dogGen.dogCreationTime);
      });
    });
    it("should permit null weight kg", async () => {
      await withDb(async (db) => {
        const userGen = await dbInsertUser(db, userSpec(1));
        const spec = dogSpec(1);
        spec.dogWeightKg = null;
        const dogGen = await dbInsertDog(db, userGen.userId, spec);

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
      const userGen = await dbInsertUser(db, userSpec(1));
      await expect(
        (async () => {
          await dbInsertDog(db, userGen.userId, spec as DogSpec);
        })(),
      ).rejects.toThrow(Error);
    }
    it("should not allow insertion of incorrect gender enum", async () => {
      await withDb(async (db) => {
        const spec: Record<string, any> = dogSpec(1);
        spec.dogGender = "F"; // Correct is 'FEMALE'
        await expectErrorWhenInserting(spec, db);
      });
    });
    it("should not allow insertion of incorrect antigen presence value", async () => {
      await withDb(async (db) => {
        const spec: Record<string, any> = dogSpec(1);
        spec.dogDea1Point1 = "+"; // Correct is 'POSITIVE'
        await expectErrorWhenInserting(spec, db);
      });
    });
    it("should not allow insertion of incorrect birthday format", async () => {
      await withDb(async (db) => {
        const spec: Record<string, any> = dogSpec(1);
        spec.dogBirthday = "2020-06"; // Correct should be padded like '2020-06-00'
        await expectErrorWhenInserting(spec, db);
      });
    });
    it("should not allow insertion of float weight", async () => {
      await withDb(async (db) => {
        const spec: Record<string, any> = dogSpec(1);
        spec.dogWeightKg = 17.5; // Cannot insert floats
        await expectErrorWhenInserting(spec, db);
      });
    });
    it("should not allow insertion of negative weight", async () => {
      // If weight is unknown, it should be null.
      await withDb(async (db) => {
        const spec: Record<string, any> = dogSpec(1);
        spec.dogWeightKg = -1;
        await expectErrorWhenInserting(spec, db);
      });
    });
    it("should not allow insertion of zero weight", async () => {
      // If weight is unknown, it should be null.
      await withDb(async (db) => {
        const spec: Record<string, any> = dogSpec(1);
        spec.dogWeightKg = 0;
        await expectErrorWhenInserting(spec, db);
      });
    });
  });
  describe("dbSelectDog", () => {
    it("should return the dog", async () => {
      await withDb(async (db) => {
        // Given a user with a dog
        const userGen = await dbInsertUser(db, userSpec(1));
        const dogGen = await dbInsertDog(db, userGen.userId, dogSpec(1));

        // When the dog is selected by dogId
        const dog = await dbSelectDog(db, dogGen.dogId);

        // Then
        expect(dog).not.toBeNull();
        expect(dog?.dogCreationTime).toBeTruthy();
        expect(dog?.dogModificationTime).toBeTruthy();
        expect(dog?.dogModificationTime).toEqual(dog?.dogCreationTime);
        expect(dog?.userId).toBe(userGen.userId);
        const spec = toDogSpec(guaranteed(dog));
        expect(spec).toMatchObject(dogSpec(1));
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
        const userGen = await dbInsertUser(db, userSpec(1));
        const dogGen = await dbInsertDog(db, userGen.userId, dogSpec(1));
        const vetGen = await dbInsertVet(db, vetSpec(1));
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
        const userGen = await dbInsertUser(db, userSpec(1));
        const dogGen = await dbInsertDog(db, userGen.userId, dogSpec(1));
        const vetGen = await dbInsertVet(db, vetSpec(1));
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
        const userGen = await dbInsertUser(db, userSpec(1));
        const dogGen = await dbInsertDog(db, userGen.userId, dogSpec(1));
        const vetGen = await dbInsertVet(db, vetSpec(1));
        const didDelete = await dbDeleteUser(db, userGen.userId);
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
        const userGen = await dbInsertUser(db, userSpec(1));
        const dogGen = await dbInsertDog(db, userGen.userId, dogSpec(1));
        const vetGen1 = await dbInsertVet(db, vetSpec(1));
        const vetGen2 = await dbInsertVet(db, vetSpec(2));
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
        const userGen = await dbInsertUser(db, userSpec(1));
        const dogGen = await dbInsertDog(db, userGen.userId, dogSpec(1));
        const vetGen1 = await dbInsertVet(db, vetSpec(1));
        const vetGen2 = await dbInsertVet(db, vetSpec(2));
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
