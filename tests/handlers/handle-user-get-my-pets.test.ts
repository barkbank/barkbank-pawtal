import { Pool } from "pg";
import { withDb } from "../_db_helpers";
import { getDogMapper, getDogOii, insertDog, insertUser } from "../_fixtures";
import { handleUserGetMyPets } from "@/lib/handlers/handle-user-get-my-pets";
import { DogMapper } from "@/lib/data/dog-mapper";

describe("handleUserGetMyPets", () => {
  const USER_IDX = 71;

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
    await Promise.all(
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
});
