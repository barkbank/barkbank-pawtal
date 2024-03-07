import { dbQuery } from "@/lib/data/db-utils";
import { withDb } from "./_db_helpers";
import {
  dogRegistration,
  getPiiEncryptionService,
  getUserAccountService,
  insertUser,
  insertVet,
  userPii,
  userRegistration,
} from "./_fixtures";
import { guaranteed } from "@/lib/bark-utils";
import { Registration, encryptDogOii } from "@/lib/user/user-models";
import { DogStatus } from "@/lib/data/db-models";

describe("UserAccountService", () => {
  describe("getUserIdByEmail", () => {
    it("should return the ID of user that matches the email", async () => {
      await withDb(async (db) => {
        // GIVEN an existing user;
        const user = await insertUser(7, db);

        // WHEN getUserIdByEmail is called with that user's email;
        const service = await getUserAccountService(db);
        const userId = await service.getUserIdByEmail(userPii(7).userEmail);

        // THEN the user ID of that user should be returned.
        expect(userId).toEqual(user.userId);
      });
    });
    it("should return null if the provided email belongs to no user", async () => {
      await withDb(async (db) => {
        // WHEN getUserIdByEmail is called with an email that does not match
        // any existing user;
        const service = await getUserAccountService(db);
        const userId = await service.getUserIdByEmail("nobody@email.com");

        // THEN null is expected.
        expect(userId).toBeNull();
      });
    });
  });
  describe("getUser", () => {
    it("should return the user matching the user ID", async () => {
      await withDb(async (db) => {
        // GIVEN an existing user;
        const userIn = await insertUser(5, db);

        // WHEN getUser is called with the ID of that user;
        const service = await getUserAccountService(db);
        const userOut = await service.getUser(userIn.userId);

        // THEN the user record for that user should be returned.
        expect(userOut).toEqual(userIn);
      });
    });
    it("should reutrn null if the user ID matches no user record", async () => {
      await withDb(async (db) => {
        // WHEN getUser is called with an ID that matches that of no user;
        const service = await getUserAccountService(db);
        const userOut = await service.getUser("12345");

        // THEN null should be returned.
        expect(userOut).toBeNull();
      });
    });
  });
  describe("getUserPii", () => {
    it("should return the PII of the user", async () => {
      await withDb(async (db) => {
        // GIVEN a user record;
        const rec = await insertUser(88, db);

        // WHEN getUserPii is called with the record;
        const service = await getUserAccountService(db);
        const pii = await service.getUserPii(rec);

        // THEN the PII from the record should be decrypted and returned.
        expect(pii).toEqual(userPii(88));
      });
    });
  });
  describe("createUserAccount", () => {
    it("should create new user account with dog", async () => {
      await withDb(async (db) => {
        // WHEN createUserAccount is called with details about a user and one
        // dog;
        const vet6 = await insertVet(6, db);
        const service = await getUserAccountService(db);
        const userReg = userRegistration(8);
        const dogReg = dogRegistration(3, {
          dogPreferredVetIdList: [vet6.vetId],
        });
        const result = await service.createUserAccount({
          user: userReg,
          dogList: [dogReg],
        });

        // THEN a user account should be created for the user detailed;
        const userId = await service.getUserIdByEmail(
          userRegistration(8).userEmail,
        );
        expect(userId).not.toBeNull();
        const user = await service.getUser(guaranteed(userId));
        const userPii = await service.getUserPii(guaranteed(user));
        expect(userPii).toMatchObject(userReg);

        // AND a dog record should be created for the one dog;
        const dogList = await service.getUserDogs(guaranteed(userId));
        expect(dogList.length).toEqual(1);
        const dog = dogList[0];

        expect(dog.dogBreed).toEqual(dogReg.dogBreed);
        expect(dog.dogBirthday).toEqual(dogReg.dogBirthday);
        expect(dog.dogGender).toEqual(dogReg.dogGender);
        expect(dog.dogWeightKg).toEqual(dogReg.dogWeightKg);
        expect(dog.dogDea1Point1).toEqual(dogReg.dogDea1Point1);
        expect(dog.dogEverPregnant).toEqual(dogReg.dogEverPregnant);
        expect(dog.dogEverReceivedTransfusion).toEqual(
          dogReg.dogEverReceivedTransfusion,
        );

        expect(dog.dogStatus).toEqual(DogStatus.NEW_PROFILE);
        expect(dog.dogEncryptedOii).toEqual(
          await encryptDogOii(
            { dogName: dogReg.dogName },
            getPiiEncryptionService(),
          ),
        );

        // AND the owner of that dog should be the created user account;
        expect(dog.userId).toEqual(userId);

        // AND the createUserAccount method should return True;
        expect(result).toBe(true);

        // AND there should be a dog-vet preference for user, dog, and vet.
        const dbRes2 = await dbQuery(
          db,
          `SELECT user_id, dog_id, vet_id FROM dog_vet_preferences`,
          [],
        );
        expect(dbRes2.rows.length).toEqual(1);
        expect(dbRes2.rows[0].user_id).toEqual(userId);
        expect(dbRes2.rows[0].dog_id).toEqual(dog.dogId);
        expect(dbRes2.rows[0].vet_id).toEqual(vet6.vetId);
      });
    });
    it("should not create user account when there is an existing account", async () => {
      await withDb(async (db) => {
        // GIVEN there is an existing user;
        await insertUser(33, db);

        // WHEN createUserAccount is called with details about a user and one
        // dog; AND this user has the same email as the existing user;
        const service = await getUserAccountService(db);
        const result = await service.createUserAccount({
          user: userRegistration(86, {
            userEmail: userPii(33).userEmail,
          }),
          dogList: [dogRegistration(91)],
        });

        //THEN no data shall be added to the database; (there should still be
        //only one user)
        const res1 = await dbQuery(db, `SELECT 1 FROM users`, []);
        expect(res1.rows.length).toEqual(1);

        // AND the createUserAccount method should return False. (I.e. rollback)
        expect(result).toBe(false);
      });
    });
    it("should create user accounts atomically", async () => {
      await withDb(async (db) => {
        // GIVEN details about a user and one dog;
        const vet6 = await insertVet(6, db);
        const service = await getUserAccountService(db);
        const userReg = userRegistration(8);
        const dogReg = dogRegistration(3, {
          dogPreferredVetIdList: [vet6.vetId],
        });
        const reg: Registration = {
          user: userReg,
          dogList: [dogReg],
        };

        // AND 5 un-awaited promises from calling createUserAccount with same
        // user and dog details;
        const promises = [
          service.createUserAccount(reg),
          service.createUserAccount(reg),
          service.createUserAccount(reg),
          service.createUserAccount(reg),
          service.createUserAccount(reg),
        ];

        // WHEN the promises are all awaited concurrently (i.e. using
        // Promise.all);
        const results = await Promise.all(promises);

        // THEN at exactly one promise should result in True;
        const numTrue = results
          .map((val) => (val ? 1 : 0))
          .reduce(
            (partialSum: number, currentValue: number) =>
              partialSum + currentValue,
            0,
          );
        expect(numTrue).toEqual(1);
      });
    });
    it("should support the creation of accounts with multiple dogs", async () => {
      await withDb(async (db) => {
        // WHEN createUserAccount is called with details about a user and three
        // dogs; THEN a user account should be created for the user detailed;
        // AND three dog records should be created; AND the owner of those dogs
        // should be the created user account; AND the createUserAccount method
        // should return True.
        fail("WIP");
      });
    });
  });
});
