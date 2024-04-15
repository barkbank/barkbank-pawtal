import { dbInsertDogVetPreference } from "@/lib/data/db-dogs";
import { withDb } from "../_db_helpers";
import {
  getDbReportSpec,
  insertCall,
  insertDog,
  insertUser,
  insertVet,
} from "../_fixtures";
import { CALL_OUTCOME, CallOutcome } from "@/lib/data/db-enums";
import { dbInsertReportAndUpdateCall } from "@/lib/data/db-reports";
import { dbQuery } from "@/lib/data/db-utils";
import { expectError } from "../_helpers";
import { Pool } from "pg";
import { DbReportSpec } from "@/lib/data/db-models";

describe("dbInsertReportAndUpdateCall", () => {
  it("should update the call outcome to REPORTED", async () => {
    await withDb(async (dbPool) => {
      // GIVEN an APPOINTMENT
      const { callId, reportSpec } = await initScenario(dbPool, {
        callOutcome: CALL_OUTCOME.APPOINTMENT,
      });

      // WHEN a report is submitted
      await dbInsertReportAndUpdateCall(dbPool, reportSpec);

      // THEN call outcome should be REPORTED
      const { callOutcome } = await fetchCallOutcome(dbPool, callId);
      expect(callOutcome).toEqual(CALL_OUTCOME.REPORTED);
    });
  });
  it("should fail when call outcome is not initially APPOINTMENT", async () => {
    await withDb(async (dbPool) => {
      // GIVEN call that is DECLINED
      const { callId, reportSpec } = await initScenario(dbPool, {
        callOutcome: CALL_OUTCOME.DECLINED,
      });

      // THEN error is expected WHEN inserting the report
      await expectError(async () => {
        await dbInsertReportAndUpdateCall(dbPool, reportSpec);
      });

      // AND call outcome should still be DECLINED.
      const { callOutcome } = await fetchCallOutcome(dbPool, callId);
      expect(callOutcome).toEqual(CALL_OUTCOME.DECLINED);
    });
  });
});

async function initScenario(
  dbPool: Pool,
  args: { callOutcome: CallOutcome },
): Promise<{ callId: string; reportSpec: DbReportSpec }> {
  const { callOutcome } = args;

  const { userId } = await insertUser(1, dbPool);
  const { dogId } = await insertDog(2, userId, dbPool);
  const { vetId } = await insertVet(3, dbPool);
  await dbInsertDogVetPreference(dbPool, dogId, vetId);
  const { callId } = await insertCall(dbPool, dogId, vetId, callOutcome);

  // WHEN attempting to add a report
  const reportSpec: DbReportSpec = getDbReportSpec(callId);
  return { callId, reportSpec };
}

async function fetchCallOutcome(
  dbPool: Pool,
  callId: string,
): Promise<{ callOutcome: CallOutcome }> {
  const sql = `
  select call_outcome as "callOutcome"
  from calls
  where call_id = $1
  `;
  const res = await dbQuery<{ callOutcome: CallOutcome }>(dbPool, sql, [
    callId,
  ]);
  return res.rows[0];
}
