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
  MEDICAL_STATUS,
  POS_NEG_NIL,
  PROFILE_STATUS,
  REPORTED_INELIGIBILITY,
  SERVICE_STATUS,
} from "@/lib/models/bark-models";

describe("dog_statuses view", () => {
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

  describe("medical_status", () => {
    const ts = new Date().getTime();
    const ELIGIBLE_SPEC: Partial<DogSpec> = {
      dogBirthday: new Date(ts - 5 * 365 * DAYS),
      dogBreed: "Big Dog",
      dogWeightKg: 25,
      dogEverPregnant: YesNoUnknown.NO,
      dogEverReceivedTransfusion: YesNoUnknown.NO,
    };
    it("should be PERMANENTLY_INELIGIBLE if dog was ever pregnant", async () => {
      await withDb(async (dbPool) => {
        const { dogId } = await initDog(dbPool, {
          dogSpec: { ...ELIGIBLE_SPEC, dogEverPregnant: YesNoUnknown.YES },
        });
        const res = await dbQuery(
          dbPool,
          `select medical_status from dog_statuses where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].medical_status).toEqual(
          MEDICAL_STATUS.PERMANENTLY_INELIGIBLE,
        );
      });
    });
    it("should be PERMANENTLY_INELIGIBLE if dog has ever received blood", async () => {
      await withDb(async (dbPool) => {
        const { dogId } = await initDog(dbPool, {
          dogSpec: {
            ...ELIGIBLE_SPEC,
            dogEverReceivedTransfusion: YesNoUnknown.YES,
          },
        });
        const res = await dbQuery(
          dbPool,
          `select medical_status from dog_statuses where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].medical_status).toEqual(
          MEDICAL_STATUS.PERMANENTLY_INELIGIBLE,
        );
      });
    });
    it("should be PERMANENTLY_INELIGIBLE if dog is 8 years or older", async () => {
      await withDb(async (dbPool) => {
        const ts = new Date().getTime();
        const { dogId } = await initDog(dbPool, {
          dogSpec: {
            ...ELIGIBLE_SPEC,
            // +2 days to account for 2 leap years in 8 years.
            // +1 to accomodate tz differences depending on when the test is run.
            dogBirthday: new Date(ts - (8 * 365 + 2 + 1) * DAYS),
          },
        });
        const res = await dbQuery(
          dbPool,
          `select medical_status from dog_statuses where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].medical_status).toEqual(
          MEDICAL_STATUS.PERMANENTLY_INELIGIBLE,
        );
      });
    });
    it("should be PERMANENTLY_INELIGIBLE if there is a medical report that said so", async () => {
      await withDb(async (dbPool) => {
        const { dogId, vetId } = await initDog(dbPool, {
          dogSpec: ELIGIBLE_SPEC,
        });
        await addReport(dbPool, dogId, vetId, {
          reportSpec: {
            dogWeightKg: 25,
            dogReportedIneligibility:
              REPORTED_INELIGIBILITY.PERMANENTLY_INELIGIBLE,
          },
        });
        const res = await dbQuery(
          dbPool,
          `select medical_status from dog_statuses where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].medical_status).toEqual(
          MEDICAL_STATUS.PERMANENTLY_INELIGIBLE,
        );
      });
    });
    it("should be UNKNOWN if pregnancy status is unknown", async () => {
      await withDb(async (dbPool) => {
        const { dogId } = await initDog(dbPool, {
          dogSpec: { ...ELIGIBLE_SPEC, dogEverPregnant: YesNoUnknown.UNKNOWN },
        });
        const res = await dbQuery(
          dbPool,
          `select medical_status from dog_statuses where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].medical_status).toEqual(MEDICAL_STATUS.UNKNOWN);
      });
    });
    it("should be UNKNOWN if blood transfusion history is unknown", async () => {
      await withDb(async (dbPool) => {
        const { dogId } = await initDog(dbPool, {
          dogSpec: {
            ...ELIGIBLE_SPEC,
            dogEverReceivedTransfusion: YesNoUnknown.UNKNOWN,
          },
        });
        const res = await dbQuery(
          dbPool,
          `select medical_status from dog_statuses where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].medical_status).toEqual(MEDICAL_STATUS.UNKNOWN);
      });
    });
    it("should be UNKNOWN if both breed and weight are unknown", async () => {
      await withDb(async (dbPool) => {
        const { dogId } = await initDog(dbPool, {
          dogSpec: {
            ...ELIGIBLE_SPEC,
            dogBreed: "",
            dogWeightKg: null,
          },
        });
        const res = await dbQuery(
          dbPool,
          `select medical_status from dog_statuses where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].medical_status).toEqual(MEDICAL_STATUS.UNKNOWN);
      });
    });
    it("should be TEMPORARILY_INELIGIBLE if dog is underweight (less than 20 KG)", async () => {
      await withDb(async (dbPool) => {
        const { dogId } = await initDog(dbPool, {
          dogSpec: {
            ...ELIGIBLE_SPEC,
            dogWeightKg: 19.9,
          },
        });
        const res = await dbQuery(
          dbPool,
          `select medical_status from dog_statuses where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].medical_status).toEqual(
          MEDICAL_STATUS.TEMPORARILY_INELIGIBLE,
        );
      });
    });
    it("should be TEMPORARILY_INELIGIBLE is less than 1 year old", async () => {
      await withDb(async (dbPool) => {
        const ts = new Date().getTime();
        const { dogId } = await initDog(dbPool, {
          dogSpec: {
            ...ELIGIBLE_SPEC,
            dogBirthday: new Date(ts - 364 * DAYS),
          },
        });
        const res = await dbQuery(
          dbPool,
          `select medical_status from dog_statuses where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].medical_status).toEqual(
          MEDICAL_STATUS.TEMPORARILY_INELIGIBLE,
        );
      });
    });
    it("TODO: should be TEMPORARILY_INELIGIBLE if it donated blood recently (3 months)", async () => {
      // TODO: Defer because it is not designed how donation information would be caputred.
      await withDb(async (dbPool) => {});
    });
    it("TODO: should be TEMPORARILY_INELIGIBLE if it was vaccinated recently (2 weeks)", async () => {
      // TODO: Defer because it is not designed how vaccination information would be captured.
      await withDb(async (dbPool) => {});
    });
    it("should be TEMPORARILY_INELIGIBLE if it tested positive for heartworm within the last 6 months", async () => {
      const ts = new Date().getTime();
      await withDb(async (dbPool) => {
        const { dogId, vetId } = await initDog(dbPool, {
          dogSpec: ELIGIBLE_SPEC,
        });
        await addReport(dbPool, dogId, vetId, {
          reportSpec: {
            dogWeightKg: 25,
            visitTime: new Date(ts - 5 * 30 * DAYS),
            dogHeartworm: POS_NEG_NIL.POSITIVE,
          },
        });
        const res = await dbQuery(
          dbPool,
          `select medical_status from dog_statuses where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].medical_status).toEqual(
          MEDICAL_STATUS.TEMPORARILY_INELIGIBLE,
        );
      });
    });
    it("should be ELIGIBLE if it tested positive for heartworm more than 6 months ago", async () => {
      const ts = new Date().getTime();
      await withDb(async (dbPool) => {
        const { dogId, vetId } = await initDog(dbPool, {
          dogSpec: ELIGIBLE_SPEC,
        });
        await addReport(dbPool, dogId, vetId, {
          reportSpec: {
            dogWeightKg: 25,
            visitTime: new Date(ts - 8 * 30 * DAYS),
            dogHeartworm: POS_NEG_NIL.POSITIVE,
          },
        });
        const res = await dbQuery(
          dbPool,
          `select medical_status from dog_statuses where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].medical_status).toEqual(MEDICAL_STATUS.ELIGIBLE);
      });
    });
    it("WIP: should be TEMPORARILY_INELIGIBLE if a report said so", async () => {
      await withDb(async (dbPool) => {});
    });
    it("should be ELIGIBLE if none of the above", async () => {
      await withDb(async (dbPool) => {
        const { dogId } = await initDog(dbPool, {
          dogSpec: ELIGIBLE_SPEC,
        });
        const res = await dbQuery(
          dbPool,
          `select medical_status from dog_statuses where dog_id = $1`,
          [dogId],
        );
        expect(res.rows[0].medical_status).toEqual(MEDICAL_STATUS.ELIGIBLE);
      });
    });
  });
});
