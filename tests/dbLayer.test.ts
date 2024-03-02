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

// TODO: Split into dbUsers.test.ts, dbVets.test.ts, etc.
describe("Database Layer", () => {
  describe("DogStatus enumeration", () => {
    it("is an enumeration of strings", () => {
      expect(DogStatus.NEW_PROFILE).toBe("NEW_PROFILE");
      expect(typeof DogStatus.NEW_PROFILE).toBe("string");
    });
  });
  describe("dbUsers", () => {
    it("should support insert and select", async () => {
      await withDb(async (db) => {
        const userGen = await dbInsertUser(db, userSpec(1));
        const user = await dbSelectUser(db, userGen.userId);
        if (!user) fail("person is null");
        expect(user.userCreationTime).toBeTruthy();
        expect(user.userModificationTime).toBeTruthy();
        expect(user.userModificationTime).toEqual(user.userCreationTime);
        const spec = toUserSpec(user);
        expect(spec).toMatchObject(userSpec(1));
      });
    });
    it("should return null when person does not exist", async () => {
      await withDb(async (db) => {
        const user = await dbSelectUser(db, "111");
        expect(user).toBeNull();
      });
    });
    it("should support retrieval of user ID by hashed email", async () => {
      await withDb(async (db) => {
        const userGen = await dbInsertUser(db, userSpec(1));
        const userId = await dbSelectUserIdByHashedEmail(
          db,
          userSpec(1).userHashedEmail,
        );
        expect(userId).toEqual(userGen.userId);
      });
    });
    it("should return null when no user exists with the hashed email", async () => {
      await withDb(async (db) => {
        const userId = await dbSelectUserIdByHashedEmail(db, "no-no-no");
        expect(userId).toBeNull();
      });
    });
    it("should update modification time on update", async () => {
      await withDb(async (db) => {
        const gen1 = await dbInsertUser(db, userSpec(1));
        ensureTimePassed();
        const gen2 = await dbUpdateUser(db, gen1.userId, userSpec(2));
        expect(gen2.userId).toEqual(gen1.userId);
        expect(gen2.userCreationTime).toEqual(gen1.userCreationTime);
        expect(gen2.userModificationTime.getTime()).toBeGreaterThan(
          gen1.userModificationTime.getTime(),
        );
      });
    });
  });
  describe("dbDogs", () => {
    it("should support insert and select", async () => {
      await withDb(async (db) => {
        const userGen = await dbInsertUser(db, userSpec(1));
        const dogGen = await dbInsertDog(db, userGen.userId, dogSpec(1));
        const dog = await dbSelectDog(db, dogGen.dogId);
        if (!dog) fail("dog is null");
        expect(dog.dogCreationTime).toBeTruthy();
        expect(dog.dogModificationTime).toBeTruthy();
        expect(dog.dogModificationTime).toEqual(dog.dogCreationTime);
        expect(dog.userId).toBe(userGen.userId);
        const spec = toDogSpec(dog);
        expect(spec).toMatchObject(dogSpec(1));
      });
    });
    it("should return null when dog does not exist", async () => {
      await withDb(async (db) => {
        const dog = await dbSelectDog(db, "111");
        expect(dog).toBeNull();
      });
    });
    it("should not allow insertion of incorrect gender enum", async () => {
      await withDb(async (db) => {
        const originalLogFn = console.error;
        console.error = jest.fn();
        const userGen = await dbInsertUser(db, userSpec(1));
        const spec: Record<string, any> = dogSpec(1);
        spec.dogGender = "F"; // Correct is 'Female'
        await expect(
          (async () => {
            await dbInsertDog(db, userGen.userId, spec as DogSpec);
          })(),
        ).rejects.toThrow(Error);
        console.error = originalLogFn;
      });
    });
    it("should not allow insertion of incorrect antigen presence value", async () => {
      await withDb(async (db) => {
        const originalLogFn = console.error;
        console.error = jest.fn();
        const userGen = await dbInsertUser(db, userSpec(1));
        const spec: Record<string, any> = dogSpec(1);
        spec.dogDea1Point1 = "+"; // Correct is 'Positive'
        await expect(
          (async () => {
            await dbInsertDog(db, userGen.userId, spec as DogSpec);
          })(),
        ).rejects.toThrow(Error);
        console.error = originalLogFn;
      });
    });
  });
  describe("dbAdmins", () => {
    it("should support insert and select", async () => {
      await withDb(async (db) => {
        const adminGen = await dbInsertAdmin(db, adminSpec(1));
        const admin = await dbSelectAdmin(db, adminGen.adminId);
        if (!admin) fail("admin is null");
        expect(admin.adminCreationTime).toBeTruthy();
        expect(admin.adminModificationTime).toBeTruthy();
        expect(admin.adminModificationTime).toEqual(admin.adminCreationTime);
        const spec = toAdminSpec(admin);
        expect(spec).toMatchObject(adminSpec(1));
      });
    });
    it("should return null when admin does not exist", async () => {
      await withDb(async (db) => {
        const admin = await dbSelectAdmin(db, "111");
        expect(admin).toBeNull();
      });
    });
    it("should support retrieval of adminId by hashed email", async () => {
      await withDb(async (db) => {
        const adminGen = await dbInsertAdmin(db, adminSpec(1));
        const adminId = await dbSelectAdminIdByAdminHashedEmail(
          db,
          adminSpec(1).adminHashedEmail,
        );
        expect(adminId).toEqual(adminGen.adminId);
      });
    });
    it("should return null adminId when admin does not exist that has the hashed email", async () => {
      await withDb(async (db) => {
        const adminId = await dbSelectAdminIdByAdminHashedEmail(
          db,
          "not_found",
        );
        expect(adminId).toBeNull();
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
