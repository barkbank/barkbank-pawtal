import { Pool } from "pg";
import { withDb } from "../_db_helpers";
import {
  insertCall,
  insertDog,
  insertReport,
  insertUser,
  insertVet,
} from "../_fixtures";
import { dbQuery } from "@/lib/data/db-utils";
import { USER_RESIDENCY } from "@/lib/data/db-models";
import { dbInsertDogVetPreference } from "@/lib/data/db-dogs";
import { CALL_OUTCOME } from "@/lib/models/bark-models";

describe("latest_values", () => {
  const USER_IDX = 84;
  const DOG_IDX = 42;
  const VET_IDX = 71;

  async function initUserOnly(dbPool: Pool): Promise<{ userId: string }> {
    const userRecord = await insertUser(USER_IDX, dbPool);
    const userId = userRecord.userId;
    return { userId };
  }

  async function initDog(
    dbPool: Pool,
  ): Promise<{ userId: string; dogId: string; vetId: string }> {
    const userRecord = await insertUser(USER_IDX, dbPool);
    const userId = userRecord.userId;
    const dogGen = await insertDog(DOG_IDX, userId, dbPool);
    const dogId = dogGen.dogId;
    const vet = await insertVet(VET_IDX, dbPool);
    const vetId = vet.vetId;
    await dbInsertDogVetPreference(dbPool, dogId, vetId);
    return { userId, dogId, vetId };
  }

  async function addReport(
    dbPool: Pool,
    dogId: string,
    vetId: string,
  ): Promise<{ reportId: string }> {
    const { callId } = await insertCall(
      dbPool,
      dogId,
      vetId,
      CALL_OUTCOME.APPOINTMENT,
    );
    const { reportId } = await insertReport(dbPool, callId);
    return { reportId };
  }

  it("should not have rows for users without dogs", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await initUserOnly(dbPool);
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
        const { userId } = await initDog(dbPool);
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

  describe("latest_dog_weight_kg", () => {
    it("should be the value in dogs when there are no reports", async () => {
      await withDb(async (dbPool) => {
        const { dogId } = await initDog(dbPool);
        await dbQuery(
          dbPool,
          `update dogs set dog_weight_kg=11.11 where dog_id = $1`,
          [dogId],
        );
        const res = await dbQuery(
          dbPool,
          `select latest_dog_weight_kg from latest_values where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].latest_dog_weight_kg).toEqual(11.11);
      });
    });
    it("should be the value from the latest report", async () => {
      await withDb(async (dbPool) => {
        const { dogId, vetId } = await initDog(dbPool);
        await dbQuery(
          dbPool,
          `update dogs set dog_weight_kg=11.11 where dog_id = $1`,
          [dogId],
        );
        const { reportId } = await addReport(dbPool, dogId, vetId);
        await dbQuery(
          dbPool,
          `update reports set dog_weight_kg=22.22 where report_id = $1`,
          [reportId],
        );
        const res = await dbQuery(
          dbPool,
          `select latest_dog_weight_kg from latest_values where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].latest_dog_weight_kg).toEqual(22.22);
      });
    });
  });
});
