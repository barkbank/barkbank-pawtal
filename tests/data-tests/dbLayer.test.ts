import { withDb } from "../_db_helpers";
import { DogSpec, DogStatus } from "@/lib/data/models";
import {
  toDogSpec,
  toUserSpec,
  toAdminSpec,
  toVetSpec,
} from "@/lib/data/mappers";
import {
  dbDeleteUser,
  dbInsertUser,
  dbSelectUser,
  dbSelectUserIdByHashedEmail,
  dbUpdateUser,
} from "@/lib/data/dbUsers";
import {
  dbDeleteDogVetPreferences,
  dbInsertDog,
  dbInsertDogVetPreference,
  dbSelectDog,
  dbSelectPreferredVetIds,
} from "@/lib/data/dbDogs";
import {
  dbInsertAdmin,
  dbSelectAdmin,
  dbSelectAdminIdByAdminHashedEmail,
} from "@/lib/data/dbAdmins";
import {
  dbInsertVet,
  dbSelectVet,
  dbSelectVetIdByEmail,
} from "@/lib/data/dbVets";
import { guaranteed } from "@/lib/bark-utils";
import { Pool } from "pg";
import {
  userSpec,
  ensureTimePassed,
  dogSpec,
  vetSpec,
  adminSpec,
} from "./_dbFixtures";

/**
 * Database Layer refers to the code in lib/data.
 */
describe("Database Layer", () => {
  describe("models", () => {
    describe("DogStatus enumeration", () => {
      it("is an enumeration of strings", () => {
        expect(DogStatus.NEW_PROFILE).toBe("NEW_PROFILE");
        expect(typeof DogStatus.NEW_PROFILE).toBe("string");
      });
    });
  });
  describe("dbUsers", () => {
    describe("dbInsertUser", () => {
      it("should insert a new user and return UserGen", async () => {
        await withDb(async (db) => {
          const userGen = await dbInsertUser(db, userSpec(1));
          expect(userGen.userCreationTime).toBeTruthy();
          expect(userGen.userModificationTime).toBeTruthy();
          expect(userGen.userModificationTime).toEqual(
            userGen.userCreationTime,
          );
        });
      });
    });
    describe("dbSelectUser", () => {
      it("should return User", async () => {
        await withDb(async (db) => {
          const userGen = await dbInsertUser(db, userSpec(1));
          const user = await dbSelectUser(db, userGen.userId);
          expect(user).not.toBeNull();
          expect(user?.userCreationTime).toEqual(userGen.userCreationTime);
          expect(user?.userModificationTime).toEqual(userGen.userCreationTime);
          const spec = toUserSpec(guaranteed(user));
          expect(spec).toMatchObject(userSpec(1));
        });
      });
      it("should return null when person does not exist", async () => {
        await withDb(async (db) => {
          const user = await dbSelectUser(db, "111");
          expect(user).toBeNull();
        });
      });
    });
    describe("dbSelectUserIdByHashedEmail", () => {
      it("should return user ID of the user matching the hashed email", async () => {
        await withDb(async (db) => {
          const userGen = await dbInsertUser(db, userSpec(1));
          const userId = await dbSelectUserIdByHashedEmail(
            db,
            userSpec(1).userHashedEmail,
          );
          expect(userId).toEqual(userGen.userId);
        });
      });
      it("should return null when no user matches the hashed email", async () => {
        await withDb(async (db) => {
          const userId = await dbSelectUserIdByHashedEmail(db, "no-no-no");
          expect(userId).toBeNull();
        });
      });
    });
    describe("dbUpdateUser", () => {
      it("should update user details and modification time", async () => {
        await withDb(async (db) => {
          const gen1 = await dbInsertUser(db, userSpec(1));
          ensureTimePassed();
          const gen2 = await dbUpdateUser(db, gen1.userId, userSpec(2));
          expect(gen2.userId).toEqual(gen1.userId);
          expect(gen2.userCreationTime).toEqual(gen1.userCreationTime);
          expect(gen2.userModificationTime.getTime()).toBeGreaterThan(
            gen1.userModificationTime.getTime(),
          );
          const user = guaranteed(await dbSelectUser(db, gen1.userId));
          const spec = toUserSpec(user);
          expect(spec).toEqual(userSpec(2));
        });
      });
    });
    describe("dbDeleteUser", () => {
      it("should remove the user record", async () => {
        await withDb(async (db) => {
          const userGen = await dbInsertUser(db, userSpec(1));
          const didDelete = await dbDeleteUser(db, userGen.userId);
          expect(didDelete).toBe(true);
          const user = await dbSelectUser(db, userGen.userId);
          expect(user).toBeNull();
        });
      });
      it("should return false if user does not exist", async () => {
        await withDb(async (db) => {
          const didDelete = await dbDeleteUser(db, "123456");
          expect(didDelete).toBe(false);
        });
      });
    });
  });
  describe("dbDogs", () => {
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
  describe("dbVets", () => {
    describe("dbInsertVet", () => {
      it("should return VetGen", async () => {
        await withDb(async (db) => {
          const vetGen = await dbInsertVet(db, vetSpec(1));
          expect(vetGen.vetCreationTime).toBeTruthy();
          expect(vetGen.vetModificationTime).toBeTruthy();
          expect(vetGen.vetModificationTime).toEqual(vetGen.vetCreationTime);
        });
      });
    });
    describe("dbSelectVet", () => {
      it("should return vet matching the vetId", async () => {
        await withDb(async (db) => {
          const vetGen = await dbInsertVet(db, vetSpec(1));
          const vet = await dbSelectVet(db, vetGen.vetId);
          expect(vet).not.toBeNull();
          expect(vet?.vetCreationTime).toBeTruthy();
          expect(vet?.vetModificationTime).toBeTruthy();
          expect(vet?.vetModificationTime).toEqual(vet?.vetCreationTime);
          const spec = toVetSpec(guaranteed(vet));
          expect(spec).toMatchObject(vetSpec(1));
        });
      });
      it("should return null no vet matches the vetId", async () => {
        await withDb(async (db) => {
          const vet = await dbSelectVet(db, "111");
          expect(vet).toBeNull();
        });
      });
    });
    describe("dbSelectVetIdByEmail", () => {
      it("should return vetId matching the email", async () => {
        await withDb(async (db) => {
          const vetGen = await dbInsertVet(db, vetSpec(1));
          const vetId = await dbSelectVetIdByEmail(db, vetSpec(1).vetEmail);
          expect(vetId).toEqual(vetGen.vetId);
        });
      });
      it("should return null when no vet matches the email", async () => {
        await withDb(async (db) => {
          const vetId = await dbSelectVetIdByEmail(db, "notavet@vet.com");
          expect(vetId).toBeNull();
        });
      });
    });
  });
});
