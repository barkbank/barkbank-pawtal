import { Pool } from "pg";
import { withDb } from "./_db_helpers";
import {
  DogDetails,
  DogGen,
  DogSecureOii,
  DogSpec,
  UserRecord,
  YesNoUnknown,
} from "@/lib/data/db-models";
import { UserActor } from "@/lib/user/user-actor";
import {
  getDogDetails,
  getDogMapper,
  getDogOii,
  getDogSecureOii,
  getUserActorConfig,
  insertDog,
  insertUser,
} from "./_fixtures";
import { ListMyPetsHandler } from "@/lib/user/handlers/list-my-pets-handler";
import { dbInsertDog } from "@/lib/data/db-dogs";
import { DOG_STATUS } from "@/lib/bark-models";

describe("ListMyPetsHandler", () => {
  const USER_IDX = 71;
  const DOG_IDX = 64;

  async function getScenario(
    dbPool: Pool,
    userIdx: number,
    options?: {
      dogIndices?: number[];
    },
  ): Promise<{
    handler: ListMyPetsHandler;
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
    const handler = new ListMyPetsHandler({
      dbPool,
      dogMapper: getDogMapper(),
    });
    return {
      handler,
      userRecord,
      userActor,
      dogGens,
    };
  }

  it("should return empty list when user has no dogs", async () => {
    await withDb(async (dbPool) => {
      const { handler, userActor } = await getScenario(dbPool, USER_IDX);
      const response = await handler.handle(userActor);
      expect(response.dogs).toEqual([]);
    });
  });
  it("should return a list of dogs belonging to the user", async () => {
    await withDb(async (dbPool) => {
      const dogIndices = [2, 3, 5, 7];
      const { handler, userActor } = await getScenario(dbPool, USER_IDX, {
        dogIndices,
      });
      const response = await handler.handle(userActor);
      const receivedName = response.dogs.map((dog) => dog.dogName);
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
      const { handler, userActor } = await getScenario(dbPool, USER_IDX);
      const details: DogDetails = await getDogDetails(DOG_IDX, {
        dogBreed: "",
        dogWeightKg: null,
      });
      const secureOii: DogSecureOii = await getDogSecureOii(DOG_IDX);
      const spec: DogSpec = { ...details, ...secureOii };
      const dogGen = await dbInsertDog(dbPool, userActor.getUserId(), spec);
      const response = await handler.handle(userActor);
      expect(response.dogs[0].dogStatus).toEqual(DOG_STATUS.INCOMPLETE);
    });
  });
  it("should set status to INELIGIBLE when dog weight is under 20KG", async () => {
    await withDb(async (dbPool) => {
      const { handler, userActor } = await getScenario(dbPool, USER_IDX);
      const details: DogDetails = await getDogDetails(DOG_IDX, {
        dogWeightKg: 19.9,
      });
      const secureOii: DogSecureOii = await getDogSecureOii(DOG_IDX);
      const spec: DogSpec = { ...details, ...secureOii };
      const dogGen = await dbInsertDog(dbPool, userActor.getUserId(), spec);
      const response = await handler.handle(userActor);
      expect(response.dogs[0].dogStatus).toEqual(DOG_STATUS.INELIGIBLE);
    });
  });
  it("should set status to PERMANENTLY_INELIGIBLE when dog ever pregnant", async () => {
    await withDb(async (dbPool) => {
      const { handler, userActor } = await getScenario(dbPool, USER_IDX);
      const details: DogDetails = await getDogDetails(DOG_IDX, {
        dogEverPregnant: YesNoUnknown.YES,

        // Use an underweight example to test that PERMANENTLY_INELIGIBLE is
        // selected over INELIGIBLE.
        dogWeightKg: 15,
      });
      const secureOii: DogSecureOii = await getDogSecureOii(DOG_IDX);
      const spec: DogSpec = { ...details, ...secureOii };
      const dogGen = await dbInsertDog(dbPool, userActor.getUserId(), spec);
      const response = await handler.handle(userActor);
      expect(response.dogs[0].dogStatus).toEqual(
        DOG_STATUS.PERMANENTLY_INELIGIBLE,
      );
    });
  });
  it("should set status to PERMANENTLY_INELIGIBLE when dog ever received blood transfusion", async () => {
    await withDb(async (dbPool) => {
      const { handler, userActor } = await getScenario(dbPool, USER_IDX);
      const details: DogDetails = await getDogDetails(DOG_IDX, {
        dogEverReceivedTransfusion: YesNoUnknown.YES,

        // Use an underweight example to test that PERMANENTLY_INELIGIBLE is
        // selected over INELIGIBLE.
        dogWeightKg: 15,
      });
      const secureOii: DogSecureOii = await getDogSecureOii(DOG_IDX);
      const spec: DogSpec = { ...details, ...secureOii };
      const dogGen = await dbInsertDog(dbPool, userActor.getUserId(), spec);
      const response = await handler.handle(userActor);
      expect(response.dogs[0].dogStatus).toEqual(
        DOG_STATUS.PERMANENTLY_INELIGIBLE,
      );
    });
  });
});
