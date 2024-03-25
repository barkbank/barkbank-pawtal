import { Pool } from "pg";
import { withDb } from "../_db_helpers";
import {
  DogDetails,
  DogSecureOii,
  DogSpec,
  YesNoUnknown,
} from "@/lib/data/db-models";
import {
  getDogDetails,
  getDogMapper,
  getDogOii,
  getDogSecureOii,
  insertDog,
  insertUser,
} from "../_fixtures";
import { handleUserGetMyPets } from "@/lib/handlers/handle-user-get-my-pets";
import { dbInsertDog } from "@/lib/data/db-dogs";
import { DOG_STATUS } from "@/lib/models/bark-models";
import { DogMapper } from "@/lib/data/dog-mapper";

describe("handleUserGetMyPets", () => {
  const USER_IDX = 71;
  const DOG_IDX = 64;

  async function getScenario(
    dbPool: Pool,
    userIdx: number,
    options?: {
      dogIndices?: number[];
    },
  ): Promise<{
    args: {
      userId: string;
      dbPool: Pool;
      dogMapper: DogMapper;
    };
    userId: string;
  }> {
    const userRecord = await insertUser(userIdx, dbPool);
    const dogGens = await Promise.all(
      (options?.dogIndices ?? []).map((dogIdx) =>
        insertDog(dogIdx, userRecord.userId, dbPool),
      ),
    );
    const userId = userRecord.userId;
    const dogMapper = getDogMapper();
    return {
      args: {
        userId,
        dbPool,
        dogMapper,
      },
      userId,
    };
  }

  it("should return empty list when user has no dogs", async () => {
    await withDb(async (dbPool) => {
      const { args } = await getScenario(dbPool, USER_IDX);
      const dogs = await handleUserGetMyPets(args);
      expect(dogs).toEqual([]);
    });
  });
  it("should return a list of dogs belonging to the user", async () => {
    await withDb(async (dbPool) => {
      const dogIndices = [2, 3, 5, 7];
      const { args } = await getScenario(dbPool, USER_IDX, {
        dogIndices,
      });
      const dogs = await handleUserGetMyPets(args);
      const receivedName = dogs.map((dog) => dog.dogName);
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
      const { args, userId } = await getScenario(dbPool, USER_IDX);
      const details: DogDetails = await getDogDetails(DOG_IDX, {
        dogBreed: "",
        dogWeightKg: null,
      });
      const secureOii: DogSecureOii = await getDogSecureOii(DOG_IDX);
      const spec: DogSpec = { ...details, ...secureOii };
      const dogGen = await dbInsertDog(dbPool, userId, spec);
      const dogs = await handleUserGetMyPets(args);
      expect(dogs[0].dogStatus).toEqual(DOG_STATUS.INCOMPLETE);
    });
  });
  it("should set status to INELIGIBLE when dog weight is under 20KG", async () => {
    await withDb(async (dbPool) => {
      const { args, userId } = await getScenario(dbPool, USER_IDX);
      const details: DogDetails = await getDogDetails(DOG_IDX, {
        dogWeightKg: 19.9,
      });
      const secureOii: DogSecureOii = await getDogSecureOii(DOG_IDX);
      const spec: DogSpec = { ...details, ...secureOii };
      const dogGen = await dbInsertDog(dbPool, userId, spec);
      const dogs = await handleUserGetMyPets(args);
      expect(dogs[0].dogStatus).toEqual(DOG_STATUS.INELIGIBLE);
    });
  });
  it("should set status to PERMANENTLY_INELIGIBLE when dog ever pregnant", async () => {
    await withDb(async (dbPool) => {
      const { args, userId } = await getScenario(dbPool, USER_IDX);
      const details: DogDetails = await getDogDetails(DOG_IDX, {
        dogEverPregnant: YesNoUnknown.YES,

        // Use an underweight example to test that PERMANENTLY_INELIGIBLE is
        // selected over INELIGIBLE.
        dogWeightKg: 15,
      });
      const secureOii: DogSecureOii = await getDogSecureOii(DOG_IDX);
      const spec: DogSpec = { ...details, ...secureOii };
      const dogGen = await dbInsertDog(dbPool, userId, spec);
      const dogs = await handleUserGetMyPets(args);
      expect(dogs[0].dogStatus).toEqual(DOG_STATUS.PERMANENTLY_INELIGIBLE);
    });
  });
  it("should set status to PERMANENTLY_INELIGIBLE when dog ever received blood transfusion", async () => {
    await withDb(async (dbPool) => {
      const { args, userId } = await getScenario(dbPool, USER_IDX);
      const details: DogDetails = await getDogDetails(DOG_IDX, {
        dogEverReceivedTransfusion: YesNoUnknown.YES,

        // Use an underweight example to test that PERMANENTLY_INELIGIBLE is
        // selected over INELIGIBLE.
        dogWeightKg: 15,
      });
      const secureOii: DogSecureOii = await getDogSecureOii(DOG_IDX);
      const spec: DogSpec = { ...details, ...secureOii };
      const dogGen = await dbInsertDog(dbPool, userId, spec);
      const dogs = await handleUserGetMyPets(args);
      expect(dogs[0].dogStatus).toEqual(DOG_STATUS.PERMANENTLY_INELIGIBLE);
    });
  });
});
