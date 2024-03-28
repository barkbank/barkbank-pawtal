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
  DogAntigenPresence,
  DogSpec,
  USER_RESIDENCY,
  UserSpec,
} from "@/lib/data/db-models";
import { dbInsertDogVetPreference } from "@/lib/data/db-dogs";
import { CALL_OUTCOME, POS_NEG_NIL } from "@/lib/models/bark-models";
import {
  DEFAULT_DATE_TIME_FORMAT,
  SINGAPORE_TIME_ZONE,
  UTC,
  parseDateTime,
} from "@/lib/bark-time";
import { getAgeMonths, getAgeYears } from "@/lib/bark-utils";
import { sprintf } from "sprintf-js";

describe("latest_values", () => {
  const USER_IDX = 84;
  const DOG_IDX = 42;
  const VET_IDX = 71;
  const DAYS = 86400000;

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
  describe("latest_dog_heartworm", () => {
    it("should be NIL when no reports", async () => {
      await withDb(async (dbPool) => {
        const { dogId } = await initDog(dbPool);
        const res = await dbQuery(
          dbPool,
          `select latest_dog_heartworm from latest_values where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].latest_dog_heartworm).toEqual(POS_NEG_NIL.NIL);
      });
    });
    it("should be the most recent non-NIL value from reports", async () => {
      await withDb(async (dbPool) => {
        const { dogId, vetId } = await initDog(dbPool);
        // GIVEN tested on 15 Oct 2023
        await addReport(dbPool, dogId, vetId, {
          reportSpec: {
            visitTime: parseDateTime("2023-10-15 15:30", {
              format: DEFAULT_DATE_TIME_FORMAT,
              timeZone: SINGAPORE_TIME_ZONE,
            }),
            dogHeartworm: POS_NEG_NIL.NEGATIVE,
          },
        });
        // BUT not tested on 2 Feb 2024
        await addReport(dbPool, dogId, vetId, {
          reportSpec: {
            visitTime: parseDateTime("2024-02-02 09:35", {
              format: DEFAULT_DATE_TIME_FORMAT,
              timeZone: SINGAPORE_TIME_ZONE,
            }),
            dogHeartworm: POS_NEG_NIL.NIL, // Did not test
          },
        });
        // WHEN latest_dog_heartworm is retrieved
        const res = await dbQuery(
          dbPool,
          `select latest_dog_heartworm from latest_values where dog_id = $1`,
          [dogId],
        );
        // THEN it should be the value from 15 Oct 2023
        expect(res.rows[0].latest_dog_heartworm).toEqual(POS_NEG_NIL.NEGATIVE);
      });
    });
  });
  describe("latest_dog_dea1_point1", () => {
    it("should be NIL when no reports and UNKNOWN in dog profile", async () => {
      await withDb(async (dbPool) => {
        const { dogId } = await initDog(dbPool, {
          dogSpec: { dogDea1Point1: DogAntigenPresence.UNKNOWN },
        });
        const res = await dbQuery(
          dbPool,
          `select latest_dog_dea1_point1 from latest_values where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].latest_dog_dea1_point1).toEqual(POS_NEG_NIL.NIL);
      });
    });
    it("should be POSITIVE when no reports and POSITIVE in dog profile", async () => {
      await withDb(async (dbPool) => {
        const { dogId } = await initDog(dbPool, {
          dogSpec: { dogDea1Point1: DogAntigenPresence.POSITIVE },
        });
        const res = await dbQuery(
          dbPool,
          `select latest_dog_dea1_point1 from latest_values where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].latest_dog_dea1_point1).toEqual(
          POS_NEG_NIL.POSITIVE,
        );
      });
    });
    it("should be the most recent non-NIL value from reports", async () => {
      await withDb(async (dbPool) => {
        const { dogId, vetId } = await initDog(dbPool, {
          dogSpec: { dogDea1Point1: DogAntigenPresence.POSITIVE },
        });
        // GIVEN tested on 15 Oct 2023
        await addReport(dbPool, dogId, vetId, {
          reportSpec: {
            visitTime: parseDateTime("2023-10-15 15:30", {
              format: DEFAULT_DATE_TIME_FORMAT,
              timeZone: SINGAPORE_TIME_ZONE,
            }),
            dogDea1Point1: POS_NEG_NIL.NEGATIVE,
          },
        });
        // BUT not tested on 2 Feb 2024
        await addReport(dbPool, dogId, vetId, {
          reportSpec: {
            visitTime: parseDateTime("2024-02-02 09:35", {
              format: DEFAULT_DATE_TIME_FORMAT,
              timeZone: SINGAPORE_TIME_ZONE,
            }),
            dogDea1Point1: POS_NEG_NIL.NIL, // Did not test
          },
        });
        // WHEN latest_dog_dea1_point1 is retrieved
        const res = await dbQuery(
          dbPool,
          `select latest_dog_dea1_point1 from latest_values where dog_id = $1`,
          [dogId],
        );
        // THEN it should be the value from 15 Oct 2023
        expect(res.rows[0].latest_dog_dea1_point1).toEqual(
          POS_NEG_NIL.NEGATIVE,
        );
      });
    });
  });
  describe("latest_dog_age_years", () => {
    it("should return the dog's age in years", async () => {
      await withDb(async (dbPool) => {
        // GIVEN a birthday that is slightly over 4 years 10 months ago;
        const ts = new Date().getTime();
        const birthday = new Date(ts - (4 * 365 + 10 * 31) * DAYS);

        // AND a dog with that birthday
        const { dogId } = await initDog(dbPool, {
          dogSpec: {
            dogBirthday: birthday,
          },
        });

        // WHEN latest_dog_age_years is retrieved from latest_values
        const res = await dbQuery(
          dbPool,
          `
          select
            latest_dog_age_years,
            CURRENT_TIMESTAMP as current_timestamp
          from latest_values
          where dog_id = $1
          `,
          [dogId],
        );

        // THEN latest_dog_age_years should be 4
        const expectedAge = getAgeYears(
          birthday,
          res.rows[0].current_timestamp,
        );
        expect(expectedAge).toEqual(4);
        expect(res.rows[0].latest_dog_age_years).toEqual(expectedAge);
      });
    });
  });
  describe("latest_dog_age_months", () => {
    it("should return the dog's age in months", async () => {
      await withDb(async (dbPool) => {
        // GIVEN a birthday that is slightly over 2 years and 3 months ago
        const ts = new Date().getTime();
        const birthday = new Date(ts - (2 * 365 + 3 * 31) * DAYS);

        // AND a dog with that birthday
        const { dogId } = await initDog(dbPool, {
          dogSpec: {
            dogBirthday: birthday,
          },
        });

        // WHEN latest_dog_age_months is retrieved from latest_values
        const res = await dbQuery(
          dbPool,
          `
          select
            latest_dog_age_months,
            CURRENT_TIMESTAMP as current_timestamp
          from latest_values
          where dog_id = $1
          `,
          [dogId],
        );

        // THEN latest_dog_age_months should be the expectedMonths
        const expectedMonths = getAgeMonths(
          birthday,
          res.rows[0].current_timestamp,
        );
        expect(expectedMonths).toEqual(2 * 12 + 3);
        expect(res.rows[0].latest_dog_age_months).toEqual(expectedMonths);
      });
    });
  });
});
