import { withDb } from "./_db_helpers";
import {
  DogAntigenPresence,
  DogGender,
  DogSpec,
  DogStatus,
  UserSpec,
  StaffSpec,
  VetSpec,
} from "@/lib/data/models";
import {
  toDogSpec,
  toUserSpec,
  toStaffSpec,
  toVetSpec,
} from "@/lib/data/mappers";
import { dbInserUser, dbSelectUser } from "@/lib/data/dbUsers";
import { sprintf } from "sprintf-js";
import { dbInsertDog, dbSelectDog } from "@/lib/data/dbDogs";
import { dbInsertStaff, dbSelectStaff } from "@/lib/data/dbAdmins";
import { dbInsertVet, dbSelectVet } from "@/lib/data/dbVets";

describe("Database Layer", () => {
  describe("DogStatus enumeration", () => {
    it("is an enumeration of strings", () => {
      expect(DogStatus.NEW_PROFILE).toBe("NEW_PROFILE");
      expect(typeof DogStatus.NEW_PROFILE).toBe("string");
    });
  });
  describe("dbPersons", () => {
    it("should support insert and select", async () => {
      await withDb(async (db) => {
        const userGen = await dbInserUser(db, userSpec(1));
        const person = await dbSelectUser(db, userGen.userId);
        if (!person) fail("person is null");
        expect(person.userCreationTime).toBeTruthy();
        const spec = toUserSpec(person);
        expect(spec).toMatchObject(userSpec(1));
      });
    });
    it("should return null when person does not exist", async () => {
      await withDb(async (db) => {
        const person = await dbSelectUser(db, "111");
        expect(person).toBeNull();
      });
    });
  });
  describe("dbDogs", () => {
    it("should support insert and select", async () => {
      await withDb(async (db) => {
        const userGen = await dbInserUser(db, userSpec(1));
        const dogGen = await dbInsertDog(db, userGen.userId, dogSpec(1));
        const dog = await dbSelectDog(db, dogGen.dogId);
        if (!dog) fail("dog is null");
        expect(dog.dogCreationTime).toBeTruthy();
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
        const userGen = await dbInserUser(db, userSpec(1));
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
        const userGen = await dbInserUser(db, userSpec(1));
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
  describe("dbStaff", () => {
    it("should support insert and select", async () => {
      await withDb(async (db) => {
        const staffGen = await dbInsertStaff(db, staffSpec(1));
        const staff = await dbSelectStaff(db, staffGen.staffId);
        if (!staff) fail("staff is null");
        expect(staff.staffCreationTime).toBeTruthy();
        const spec = toStaffSpec(staff);
        expect(spec).toMatchObject(staffSpec(1));
      });
    });
    it("should return null when staff does not exist", async () => {
      await withDb(async (db) => {
        const staff = await dbSelectStaff(db, "111");
        expect(staff).toBeNull();
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
  });
});

function userSpec(idx: number): UserSpec {
  return {
    userEmail: email(idx),
    userName: `User ${idx}`,
    userPhoneNumber: phoneNumber(idx),
  };
}

function staffSpec(idx: number): StaffSpec {
  return {
    staffEmail: email(idx),
    staffName: `Staff ${idx}`,
    staffPhoneNumber: phoneNumber(idx),
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
    dogName: `dogName${idx}`,
    dogBreed: `dogBreed${idx}`,
    dogBirthMonth: yearMonth(idx),
    dogGender: dogGender(idx),
    dogDea1Point1: dogAntigenPresence(idx + 1 + 1),
  };
}

function yearMonth(idx: number): string {
  const baseYear = 2023;
  const yearOffset = idx % 5;
  const year = baseYear - yearOffset;
  const monthOfYear = idx % 13;
  return sprintf("%d-%02d", year, monthOfYear);
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

function email(idx: number): string {
  return `user${idx}@system.com`;
}

function phoneNumber(idx: number): string {
  return (90001000 + idx).toString();
}
