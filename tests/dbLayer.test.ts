import { withDb } from "./_db_helpers";
import {
  DogAntigenPresence,
  DogGender,
  DogSpec,
  DogStatus,
  UserSpec,
  AdminSpec,
  VetSpec,
} from "@/lib/data/models";
import {
  toDogSpec,
  toUserSpec,
  toAdminSpec,
  toVetSpec,
} from "@/lib/data/mappers";
import {
  dbInsertUser,
  dbSelectUser,
  dbSelectUserIdByHashedEmail,
  dbUpdateUser,
} from "@/lib/data/dbUsers";
import { sprintf } from "sprintf-js";
import { dbInsertDog, dbSelectDog } from "@/lib/data/dbDogs";
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
  });
  describe("dbAdmins", () => {
    describe("dbInsertAdmin", () => {
      it("should insert an admin", async () => {
        await withDb(async (db) => {
          const adminGen = await dbInsertAdmin(db, adminSpec(1));
          expect(adminGen.adminCreationTime).toBeTruthy();
          expect(adminGen.adminModificationTime).toBeTruthy();
          expect(adminGen.adminModificationTime).toEqual(
            adminGen.adminCreationTime,
          );
        });
      });
    });
    describe("dbSelectAdmin", () => {
      it("should return admin matching the adminId", async () => {
        await withDb(async (db) => {
          const adminGen = await dbInsertAdmin(db, adminSpec(1));
          const admin = await dbSelectAdmin(db, adminGen.adminId);
          expect(admin).not.toBeNull();
          expect(admin?.adminCreationTime).toBeTruthy();
          expect(admin?.adminModificationTime).toBeTruthy();
          expect(admin?.adminModificationTime).toEqual(
            admin?.adminCreationTime,
          );
          const spec = toAdminSpec(guaranteed(admin));
          expect(spec).toMatchObject(adminSpec(1));
        });
      });
      it("should return null when no admin matches the adminId", async () => {
        await withDb(async (db) => {
          const admin = await dbSelectAdmin(db, "111");
          expect(admin).toBeNull();
        });
      });
    });
    describe("dbSelectAdminIdByAdminHashedEmail", () => {
      it("should return adminId matching the hashed email", async () => {
        await withDb(async (db) => {
          const adminGen = await dbInsertAdmin(db, adminSpec(1));
          const adminId = await dbSelectAdminIdByAdminHashedEmail(
            db,
            adminSpec(1).adminHashedEmail,
          );
          expect(adminId).toEqual(adminGen.adminId);
        });
      });
      it("should return null when no admin matches the hashed email", async () => {
        await withDb(async (db) => {
          const adminId = await dbSelectAdminIdByAdminHashedEmail(
            db,
            "not_found",
          );
          expect(adminId).toBeNull();
        });
      });
    });
  });
  describe("dbVets", () => {
    it("should support insert and select", async () => {
      await withDb(async (db) => {
        const vetGen = await dbInsertVet(db, vetSpec(1));
        const vet = await dbSelectVet(db, vetGen.vetId);
        if (!vet) fail("vet is null");
        expect(vet.vetCreationTime).toBeTruthy();
        expect(vet.vetModificationTime).toBeTruthy();
        expect(vet.vetModificationTime).toEqual(vet.vetCreationTime);
        const spec = toVetSpec(vet);
        expect(spec).toMatchObject(vetSpec(1));
      });
    });
    it("should return null when vet does not exist", async () => {
      await withDb(async (db) => {
        const vet = await dbSelectVet(db, "111");
        expect(vet).toBeNull();
      });
    });
    it("should support retrieval of vet ID by email", async () => {
      await withDb(async (db) => {
        const vetGen = await dbInsertVet(db, vetSpec(1));
        const vetId = await dbSelectVetIdByEmail(db, vetSpec(1).vetEmail);
        expect(vetId).toEqual(vetGen.vetId);
      });
    });
    it("should return null when no vet exists with the email", async () => {
      await withDb(async (db) => {
        const vetId = await dbSelectVetIdByEmail(db, "notavet@vet.com");
        expect(vetId).toBeNull();
      });
    });
  });
});

function ensureTimePassed(): void {
  const t0 = new Date().getTime();
  let t1 = new Date().getTime();
  while (t0 === t1) {
    t1 = new Date().getTime();
  }
}

function userSpec(idx: number): UserSpec {
  return {
    userHashedEmail: hashedEmail(idx),
    userEncryptedPii: encryptedPii(idx),
  };
}

function adminSpec(idx: number): AdminSpec {
  return {
    adminHashedEmail: hashedEmail(idx),
    adminEncryptedPii: encryptedPii(idx),
  };
}

function vetSpec(idx: number): VetSpec {
  return {
    vetEmail: email(idx),
    vetName: `Vet${idx}`,
    vetPhoneNumber: phoneNumber(idx),
    vetAddress: `1${idx} Jalan Mango`,
  };
}

function dogSpec(idx: number): DogSpec {
  return {
    dogStatus: dogStatus(idx),
    dogEncryptedOii: `dogEncryptedOii-${idx}`,
    dogBreed: `dogBreed${idx}`,
    dogBirthday: birthday(idx),
    dogGender: dogGender(idx),
    dogDea1Point1: dogAntigenPresence(idx + 1 + 1),
  };
}

function birthday(idx: number): string {
  const baseYear = 2023;
  const yearOffset = idx % 5;
  const year = baseYear - yearOffset;
  const monthOfYear = idx % 13;
  const dayOfMonth = idx % 29;
  return sprintf("%d-%02d-%02d", year, monthOfYear, dayOfMonth);
}

function dogAntigenPresence(idx: number): DogAntigenPresence {
  const presenceList: DogAntigenPresence[] = Object.values(DogAntigenPresence);
  return presenceList[idx % presenceList.length];
}

function dogGender(idx: number): DogGender {
  const genderList: DogGender[] = Object.values(DogGender);
  return genderList[idx % genderList.length];
}

function dogStatus(idx: number): DogStatus {
  const statusList: DogStatus[] = Object.values(DogStatus);
  return statusList[idx % statusList.length];
}

function encryptedPii(idx: number): string {
  return `encryptedPii(${idx})`;
}

function hashedEmail(idx: number): string {
  return `hashed(${email(idx)})`;
}

function email(idx: number): string {
  return `user${idx}@system.com`;
}

function phoneNumber(idx: number): string {
  return (90001000 + idx).toString();
}
