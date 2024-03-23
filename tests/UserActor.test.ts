import { withDb } from "./_db_helpers";
import { UserActor } from "@/lib/user/user-actor";
import {
  getDogDetails,
  getDogOii,
  getDogSecureOii,
  getUserActorConfig,
  insertDog,
  insertUser,
  userPii,
} from "./_fixtures";
import { Pool } from "pg";
import {
  DogDetails,
  DogGen,
  DogSecureOii,
  DogSpec,
  UserRecord,
  YesNoUnknown,
} from "@/lib/data/db-models";
import { dbInsertDog } from "@/lib/data/db-dogs";
import { DOG_STATUS } from "@/lib/bark-models";

describe("UserActor", () => {
  const USER_IDX = 71;
  const DOG_IDX = 64;

  async function getScenario(
    dbPool: Pool,
    userIdx: number,
    options?: {
      dogIndices?: number[];
    },
  ): Promise<{
    userRecord: UserRecord;
    userActor: UserActor;
    dogGens: DogGen[];
  }> {
    const userRecord = await insertUser(userIdx, dbPool);
    const dogGens = await Promise.all(
      (options?.dogIndices ?? []).map((dogIdx) =>
        insertDog(dogIdx, userRecord.userId, dbPool),
      ),
    );
    const userActor = new UserActor(
      userRecord.userId,
      getUserActorConfig(dbPool),
    );
    return {
      userRecord,
      userActor,
      dogGens,
    };
  }

  it("can retrieve its own actor data from the database", async () => {
    await withDb(async (dbPool) => {
      const { userRecord, userActor } = await getScenario(dbPool, USER_IDX);
      const ownUser = await userActor.getOwnUserRecord();
      expect(ownUser).toEqual(userRecord);
    });
  });
  it("can retrieve its own PII", async () => {
    await withDb(async (dbPool) => {
      const { userActor } = await getScenario(dbPool, USER_IDX);
      const ownPii = await userActor.getOwnUserPii();
      expect(ownPii).toEqual(userPii(USER_IDX));
    });
  });
  describe("getDogList", () => {
    it("should return empty list when user has no dogs", async () => {
      await withDb(async (dbPool) => {
        const { userActor } = await getScenario(dbPool, USER_IDX);
        const dogList = await userActor.getDogList();
        expect(dogList.dogs).toEqual([]);
      });
    });
    it("should return a list of dogs belonging to the user", async () => {
      await withDb(async (dbPool) => {
        const dogIndices = [2, 3, 5, 7];
        const { userActor } = await getScenario(dbPool, USER_IDX, {
          dogIndices,
        });
        const dogList = await userActor.getDogList();
        const receivedName = dogList.dogs.map((dog) => dog.dogName);
        const expectedNames = await Promise.all(
          dogIndices.map(async (idx) => {
            const oii = await getDogOii(idx);
            return oii.dogName;
          }),
        );
        expect(receivedName.sort()).toEqual(expectedNames.sort());
      });
    });
    it("should set status to INCOMPLETE when both breed and weight are unspecified", async () => {
      await withDb(async (dbPool) => {
        const { userActor } = await getScenario(dbPool, USER_IDX);
        const details: DogDetails = await getDogDetails(DOG_IDX, {
          dogBreed: "",
          dogWeightKg: null,
        });
        const secureOii: DogSecureOii = await getDogSecureOii(DOG_IDX);
        const spec: DogSpec = { ...details, ...secureOii };
        const dogGen = await dbInsertDog(dbPool, userActor.getUserId(), spec);
        const dogList = await userActor.getDogList();
        expect(dogList.dogs[0].dogStatus).toEqual(DOG_STATUS.INCOMPLETE);
      });
    });
    it("should set status to INELIGIBLE when dog weight is under 20KG", async () => {
      await withDb(async (dbPool) => {
        const { userActor } = await getScenario(dbPool, USER_IDX);
        const details: DogDetails = await getDogDetails(DOG_IDX, {
          dogWeightKg: 19.9,
        });
        const secureOii: DogSecureOii = await getDogSecureOii(DOG_IDX);
        const spec: DogSpec = { ...details, ...secureOii };
        const dogGen = await dbInsertDog(dbPool, userActor.getUserId(), spec);
        const dogList = await userActor.getDogList();
        expect(dogList.dogs[0].dogStatus).toEqual(DOG_STATUS.INELIGIBLE);
      });
    });
    it("should set status to PERMANENTLY_INELIGIBLE when dog ever pregnant", async () => {
      await withDb(async (dbPool) => {
        const { userActor } = await getScenario(dbPool, USER_IDX);
        const details: DogDetails = await getDogDetails(DOG_IDX, {
          dogEverPregnant: YesNoUnknown.YES,
          dogWeightKg: 15,
        });
        const secureOii: DogSecureOii = await getDogSecureOii(DOG_IDX);
        const spec: DogSpec = { ...details, ...secureOii };
        const dogGen = await dbInsertDog(dbPool, userActor.getUserId(), spec);
        const dogList = await userActor.getDogList();
        expect(dogList.dogs[0].dogStatus).toEqual(
          DOG_STATUS.PERMANENTLY_INELIGIBLE,
        );
      });
    });
    it("should set status to PERMANENTLY_INELIGIBLE when dog ever received blood transfusion", async () => {
      await withDb(async (dbPool) => {
        const { userActor } = await getScenario(dbPool, USER_IDX);
        const details: DogDetails = await getDogDetails(DOG_IDX, {
          dogEverReceivedTransfusion: YesNoUnknown.YES,
          dogWeightKg: 15,
        });
        const secureOii: DogSecureOii = await getDogSecureOii(DOG_IDX);
        const spec: DogSpec = { ...details, ...secureOii };
        const dogGen = await dbInsertDog(dbPool, userActor.getUserId(), spec);
        const dogList = await userActor.getDogList();
        expect(dogList.dogs[0].dogStatus).toEqual(
          DOG_STATUS.PERMANENTLY_INELIGIBLE,
        );
      });
    });
  });
});
