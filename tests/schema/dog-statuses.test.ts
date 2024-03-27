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
  YesNoUnknown,
} from "@/lib/data/db-models";
import { dbInsertDogVetPreference } from "@/lib/data/db-dogs";
import {
  CALL_OUTCOME,
  PROFILE_STATUS,
  SERVICE_STATUS,
} from "@/lib/models/bark-models";

describe("dog_statuses view", () => {
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
        `select 1 from dog_statuses where user_id = $1`,
        [userId],
      );
      expect(res.rows.length).toEqual(0);
    });
  });

  describe("service_status", () => {
    it("should be AVAILABLE when user residency is SINGAPORE", async () => {
      await withDb(async (dbPool) => {
        const { dogId } = await initDog(dbPool, {
          userSpec: { userResidency: USER_RESIDENCY.SINGAPORE },
        });
        const res = await dbQuery(
          dbPool,
          `select service_status from dog_statuses where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].service_status).toEqual(SERVICE_STATUS.AVAILABLE);
      });
    });
    it("should be UNAVAILABLE when user residency is OTHER", async () => {
      await withDb(async (dbPool) => {
        const { dogId } = await initDog(dbPool, {
          userSpec: { userResidency: USER_RESIDENCY.OTHER },
        });
        const res = await dbQuery(
          dbPool,
          `select service_status from dog_statuses where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].service_status).toEqual(SERVICE_STATUS.UNAVAILABLE);
      });
    });
  });

  describe("profile_status", () => {
    it("should be COMPLETE when breed, weight, and histories are known", async () => {
      await withDb(async (dbPool) => {
        const { dogId } = await initDog(dbPool, {
          dogSpec: {
            dogBreed: "Test Dog",
            dogWeightKg: 18,
            dogEverPregnant: YesNoUnknown.NO,
            dogEverReceivedTransfusion: YesNoUnknown.NO,
          },
        });
        const res = await dbQuery(
          dbPool,
          `select profile_status from dog_statuses where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].profile_status).toEqual(PROFILE_STATUS.COMPLETE);
      });
    });
    it("should be INCOMPLETE when breed and weight are unknown", async () => {
      await withDb(async (dbPool) => {
        const { dogId } = await initDog(dbPool, {
          dogSpec: {
            dogBreed: "",
            dogWeightKg: null,
            dogEverPregnant: YesNoUnknown.NO,
            dogEverReceivedTransfusion: YesNoUnknown.NO,
          },
        });
        const res = await dbQuery(
          dbPool,
          `select profile_status from dog_statuses where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].profile_status).toEqual(PROFILE_STATUS.INCOMPLETE);
      });
    });
    it("should be INCOMPLETE when pregnancy history is unkonwn", async () => {
      await withDb(async (dbPool) => {
        const { dogId } = await initDog(dbPool, {
          dogSpec: {
            dogBreed: "Test Dog",
            dogWeightKg: 18,
            dogEverPregnant: YesNoUnknown.UNKNOWN,
            dogEverReceivedTransfusion: YesNoUnknown.NO,
          },
        });
        const res = await dbQuery(
          dbPool,
          `select profile_status from dog_statuses where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].profile_status).toEqual(PROFILE_STATUS.INCOMPLETE);
      });
    });
    it("should be INCOMPLETE when transfusion history is unkonwn", async () => {
      await withDb(async (dbPool) => {
        const { dogId } = await initDog(dbPool, {
          dogSpec: {
            dogBreed: "Test Dog",
            dogWeightKg: 18,
            dogEverPregnant: YesNoUnknown.NO,
            dogEverReceivedTransfusion: YesNoUnknown.UNKNOWN,
          },
        });
        const res = await dbQuery(
          dbPool,
          `select profile_status from dog_statuses where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].profile_status).toEqual(PROFILE_STATUS.INCOMPLETE);
      });
    });
  });
});
