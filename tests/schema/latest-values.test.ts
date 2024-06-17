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
import { DbReportSpec, DogSpec, UserSpec } from "@/lib/data/db-models";
import { DOG_ANTIGEN_PRESENCE } from "@/lib/data/db-enums";
import { dbInsertDogVetPreference } from "@/lib/data/db-dogs";
import { POS_NEG_NIL } from "@/lib/data/db-enums";
import { CALL_OUTCOME } from "@/lib/bark/enums/call-outcome";
import {
  YYYY_MM_DD_HH_MM_FORMAT,
  SINGAPORE_TIME_ZONE,
  parseDateTime,
} from "@/lib/utilities/bark-time";
import { getAgeMonths } from "@/lib/utilities/bark-age";
import { dateAgo, weeksAgo } from "../_time_helpers";

describe("latest_values", () => {
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
    it("should use report value when visit-time is more recent than profile-modification-time", async () => {
      await withDb(async (dbPool) => {
        // GIVEN record
        const { dogId, vetId } = await initDog(dbPool, {
          dogSpec: { dogWeightKg: 11.11 },
          profileModificationTime: weeksAgo(52),
        });

        // AND report 1
        const r1 = await addReport(dbPool, dogId, vetId, {
          reportSpec: { dogWeightKg: 22.22, visitTime: weeksAgo(26) },
        });

        // AND report 2
        const r2 = await addReport(dbPool, dogId, vetId, {
          reportSpec: {
            dogWeightKg: 33.33,
            visitTime: weeksAgo(1), // <-- most recent
          },
        });

        // WHEN
        const res = await dbQuery(
          dbPool,
          `select latest_dog_weight_kg from latest_values where dog_id = $1`,
          [dogId],
        );

        // THEN expect the weight from the second report
        expect(res.rows[0].latest_dog_weight_kg).toEqual(33.33);
      });
    });
    it("should use dog-record value when dog-modification-time is more recent than visit-time", async () => {
      await withDb(async (dbPool) => {
        // GIVEN record
        const { dogId, vetId } = await initDog(dbPool, {
          dogSpec: { dogWeightKg: 11.11 },
          profileModificationTime: weeksAgo(1), // <-- most recent
        });

        // AND report 1
        await addReport(dbPool, dogId, vetId, {
          reportSpec: { dogWeightKg: 22.22, visitTime: weeksAgo(52) },
        });

        // AND report 2
        await addReport(dbPool, dogId, vetId, {
          reportSpec: { dogWeightKg: 33.33, visitTime: weeksAgo(26) },
        });

        // WHEN
        const res = await dbQuery(
          dbPool,
          `select latest_dog_weight_kg from latest_values where dog_id = $1`,
          [dogId],
        );

        // THEN expect the weight from the dog record
        expect(res.rows[0].latest_dog_weight_kg).toEqual(11.11);
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
  describe("latest_dog_heartworm_result", () => {
    it("should be NIL when no reports", async () => {
      await withDb(async (dbPool) => {
        const { dogId } = await initDog(dbPool);
        const res = await dbQuery(
          dbPool,
          `select latest_dog_heartworm_result from latest_values where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].latest_dog_heartworm_result).toEqual(
          POS_NEG_NIL.NIL,
        );
      });
    });
    it("should be the most recent non-NIL value from reports", async () => {
      await withDb(async (dbPool) => {
        const { dogId, vetId } = await initDog(dbPool);
        // GIVEN tested on 15 Oct 2023
        await addReport(dbPool, dogId, vetId, {
          reportSpec: {
            visitTime: parseDateTime("2023-10-15 15:30", {
              format: YYYY_MM_DD_HH_MM_FORMAT,
              timeZone: SINGAPORE_TIME_ZONE,
            }),
            dogHeartworm: POS_NEG_NIL.NEGATIVE,
          },
        });
        // BUT not tested on 2 Feb 2024
        await addReport(dbPool, dogId, vetId, {
          reportSpec: {
            visitTime: parseDateTime("2024-02-02 09:35", {
              format: YYYY_MM_DD_HH_MM_FORMAT,
              timeZone: SINGAPORE_TIME_ZONE,
            }),
            dogHeartworm: POS_NEG_NIL.NIL, // Did not test
          },
        });
        // WHEN latest_dog_heartworm_result is retrieved
        const res = await dbQuery(
          dbPool,
          `select latest_dog_heartworm_result from latest_values where dog_id = $1`,
          [dogId],
        );
        // THEN it should be the value from 15 Oct 2023
        expect(res.rows[0].latest_dog_heartworm_result).toEqual(
          POS_NEG_NIL.NEGATIVE,
        );
      });
    });
  });
  describe("latest_dog_dea1_point1", () => {
    it("should be NIL when no reports and UNKNOWN in dog profile", async () => {
      await withDb(async (dbPool) => {
        const { dogId } = await initDog(dbPool, {
          dogSpec: { dogDea1Point1: DOG_ANTIGEN_PRESENCE.UNKNOWN },
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
          dogSpec: { dogDea1Point1: DOG_ANTIGEN_PRESENCE.POSITIVE },
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
          dogSpec: { dogDea1Point1: DOG_ANTIGEN_PRESENCE.POSITIVE },
        });
        // GIVEN tested on 15 Oct 2023
        await addReport(dbPool, dogId, vetId, {
          reportSpec: {
            visitTime: parseDateTime("2023-10-15 15:30", {
              format: YYYY_MM_DD_HH_MM_FORMAT,
              timeZone: SINGAPORE_TIME_ZONE,
            }),
            dogDea1Point1: POS_NEG_NIL.NEGATIVE,
          },
        });
        // BUT not tested on 2 Feb 2024
        await addReport(dbPool, dogId, vetId, {
          reportSpec: {
            visitTime: parseDateTime("2024-02-02 09:35", {
              format: YYYY_MM_DD_HH_MM_FORMAT,
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
  describe("latest_dog_age_months", () => {
    it("should return the dog's age in months", async () => {
      await withDb(async (dbPool) => {
        // GIVEN a birthday that is around 2 years and 3 months ago
        const birthday = dateAgo({ numYears: 2, numMonths: 3 });

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
        const latestDogAgeMonths = res.rows[0].latest_dog_age_months;
        console.debug({ birthday, expectedMonths, latestDogAgeMonths });
        expect(latestDogAgeMonths).toEqual(expectedMonths);

        // NOTE: We cannot simply compare with 2*12+3 because dateAgo assumes
        // months are 30 days. So on 30 May 2024, this assertion will fail.
        //
        // expect(expectedMonths).toEqual(2 * 12 + 3);
      });
    });
  });
  describe("latest_blood_donation_time", () => {
    it("should be NULL when there is no record of a blood donation", async () => {
      await withDb(async (dbPool) => {
        const { dogId, vetId } = await initDog(dbPool);
        const res = await dbQuery(
          dbPool,
          `SELECT latest_blood_donation_time FROM latest_values WHERE dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].latest_blood_donation_time).toBeNull();
      });
    });
    it("should be latest time a blood donation was done", async () => {
      await withDb(async (dbPool) => {
        const { dogId, vetId } = await initDog(dbPool);
        const twoYearsAgo = dateAgo({ numYears: 2 });
        const oneYearAgo = dateAgo({ numYears: 1 });
        await addReport(dbPool, dogId, vetId, {
          reportSpec: { visitTime: twoYearsAgo, dogDidDonateBlood: true },
        });
        await addReport(dbPool, dogId, vetId, {
          reportSpec: { visitTime: oneYearAgo, dogDidDonateBlood: true },
        });
        const res = await dbQuery(
          dbPool,
          `SELECT latest_blood_donation_time FROM latest_values WHERE dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].latest_blood_donation_time).toEqual(oneYearAgo);
      });
    });
  });
});

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
    profileModificationTime?: Date;
  },
): Promise<{ userId: string; dogId: string; vetId: string }> {
  const userRecord = await insertUser(USER_IDX, dbPool, overrides?.userSpec);
  const userId = userRecord.userId;
  const dogGen = await insertDog(DOG_IDX, userId, dbPool, overrides?.dogSpec);
  const dogId = dogGen.dogId;
  const vet = await insertVet(VET_IDX, dbPool);
  const vetId = vet.vetId;
  await dbInsertDogVetPreference(dbPool, dogId, vetId);

  // Modify the profile modification time if a value was provided.
  const profileModificationTime = overrides?.profileModificationTime;
  if (profileModificationTime !== undefined) {
    await dbQuery(
      dbPool,
      `
      update dogs
      set profile_modification_time = $2
      where dog_id = $1
      `,
      [dogId, profileModificationTime],
    );
  }
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
