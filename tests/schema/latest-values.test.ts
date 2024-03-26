import { Pool } from "pg";
import { withDb } from "../_db_helpers";
import { insertDog, insertUser } from "../_fixtures";
import { dbQuery } from "@/lib/data/db-utils";
import { USER_RESIDENCY } from "@/lib/data/db-models";

describe("latest_values", () => {
  const USER_IDX = 84;
  const DOG_IDX = 42;

  async function initUser(dbPool: Pool): Promise<{ userId: string }> {
    const userRecord = await insertUser(USER_IDX, dbPool);
    const userId = userRecord.userId;
    return { userId };
  }

  async function initUserAndDog(
    dbPool: Pool,
  ): Promise<{ userId: string; dogId: string }> {
    const userRecord = await insertUser(USER_IDX, dbPool);
    const userId = userRecord.userId;
    const dogGen = await insertDog(DOG_IDX, userId, dbPool);
    const dogId = dogGen.dogId;
    return { userId, dogId };
  }

  it("should not have rows for users without dogs", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await initUser(dbPool);
      const res = await dbQuery(
        dbPool,
        `select 1 from latest_values where user_id = $1`,
        [userId],
      );
      expect(res.rows.length).toEqual(0);
    });
  });

  describe("latest_user_residency", () => {
    it("should be the residency of each dog's owner", async () => {
      await withDb(async (dbPool) => {
        const { userId, dogId } = await initUserAndDog(dbPool);
        await dbQuery(
          dbPool,
          `update users set user_residency = $2 where user_id = $1`,
          [userId, USER_RESIDENCY.OTHER],
        );
        const res = await dbQuery(
          dbPool,
          `select latest_user_residency from latest_values where user_id = $1`,
          [userId],
        );
        expect(res.rows[0].latest_user_residency).toEqual(USER_RESIDENCY.OTHER);
      });
    });
  });
});
