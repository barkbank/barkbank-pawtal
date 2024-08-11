import { withDb } from "../_db_helpers";
import { UserActor } from "@/lib/user/user-actor";
import { getUserActor, insertDog, insertUser, userPii } from "../_fixtures";
import { Pool } from "pg";
import { DogGen, UserRecord } from "@/lib/data/db-models";

describe("UserActor", () => {
  const USER_IDX = 71;

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
    const userActor = getUserActor(dbPool, userRecord.userId);
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
});
