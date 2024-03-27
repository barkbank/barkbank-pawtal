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
import {
  DbReportSpec,
  DogSpec,
  USER_RESIDENCY,
  UserSpec,
} from "@/lib/data/db-models";
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
    overrides?: {
      userSpec?: Partial<UserSpec>;
      dogSpec?: Partial<DogSpec>;
    },
  ): Promise<{ userId: string; dogId: string; vetId: string }> {
    const userRecord = await insertUser(USER_IDX, dbPool, overrides?.userSpec);
    const userId = userRecord.userId;
    const dogGen = await insertDog(DOG_IDX, userId, dbPool, overrides?.dogSpec);
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
    overrides?: {
      reportSpec?: Partial<DbReportSpec>;
    },
  ): Promise<{ reportId: string }> {
    const { callId } = await insertCall(
      dbPool,
      dogId,
      vetId,
      CALL_OUTCOME.APPOINTMENT,
    );
    const { reportId } = await insertReport(
      dbPool,
      callId,
      overrides?.reportSpec,
    );
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
        const { userId } = await initDog(dbPool, {
          userSpec: { userResidency: USER_RESIDENCY.OTHER },
        });
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
        const { dogId } = await initDog(dbPool, {
          dogSpec: { dogWeightKg: 11.11 },
        });
        const res = await dbQuery(
          dbPool,
          `select latest_dog_weight_kg from latest_values where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].latest_dog_weight_kg).toEqual(11.11);
      });
    });
    it("should be the value in dogs when there are no reports, in this case NULL", async () => {
      await withDb(async (dbPool) => {
        const { dogId } = await initDog(dbPool, {
          dogSpec: { dogWeightKg: null },
        });
        const res = await dbQuery(
          dbPool,
          `select latest_dog_weight_kg from latest_values where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].latest_dog_weight_kg).toBeNull();
      });
    });
    it("should be the value from the latest report", async () => {
      await withDb(async (dbPool) => {
        const { dogId, vetId } = await initDog(dbPool, {
          dogSpec: { dogWeightKg: 11.11 },
        });
        await addReport(dbPool, dogId, vetId, {
          reportSpec: { dogWeightKg: 22.22 },
        });
        const res = await dbQuery(
          dbPool,
          `select latest_dog_weight_kg from latest_values where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].latest_dog_weight_kg).toEqual(22.22);
      });
    });
  });
  describe("latest_dog_body_conditioning_score", () => {
    it("should be the score from the latest report", async () => {
      await withDb(async (dbPool) => {
        const { dogId, vetId } = await initDog(dbPool);
        await addReport(dbPool, dogId, vetId, {
          reportSpec: { dogBodyConditioningScore: 5 },
        });
        const res = await dbQuery(
          dbPool,
          `select latest_dog_body_conditioning_score from latest_values where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].latest_dog_body_conditioning_score).toEqual(5);
      });
    });
    it("should be null when no reports", async () => {
      await withDb(async (dbPool) => {
        const { dogId } = await initDog(dbPool);
        const res = await dbQuery(
          dbPool,
          `select latest_dog_body_conditioning_score from latest_values where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].latest_dog_body_conditioning_score).toBeNull();
      });
    });
  });
});
