import { Pool } from "pg";
import { withDb } from "../_db_helpers";
import { insertUser } from "../_fixtures";
import { dbQuery } from "@/lib/data/db-utils";

describe("dog_statuses view", () => {
  const USER_IDX = 84;
  const DOG_IDX = 42;
  const VET_IDX = 71;

  async function initUserOnly(dbPool: Pool): Promise<{ userId: string }> {
    const userRecord = await insertUser(USER_IDX, dbPool);
    const userId = userRecord.userId;
    return { userId };
  }

  it("should not have rows for users without dogs", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await initUserOnly(dbPool);
      const res = await dbQuery(
        dbPool,
        `select 1 from dog_statuses where user_id = $1`,
        [userId],
      );
      expect(res.rows.length).toEqual(0);
    });
  });
});
