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

describe("dbInsertReportAndUpdateCall", () => {
  it("should resolve dog and vet ID from the input call ID", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      const { dogId } = await insertDog(2, userId, dbPool);
      const { vetId } = await insertVet(3, dbPool);
      await dbInsertDogVetPreference(dbPool, dogId, vetId);
      const { callId } = await insertCall(
        dbPool,
        dogId,
        vetId,
        CALL_OUTCOME.APPOINTMENT,
      );
      const spec = getDbReportSpec(callId);
      const gen = await dbInsertReportAndUpdateCall(dbPool, spec);
      expect(gen.dogId).toEqual(dogId);
      expect(gen.vetId).toEqual(vetId);
    });
  });
  it("should update the call outcome to REPORTED", async () => {
    await withDb(async (dbPool) => {
      const { userId } = await insertUser(1, dbPool);
      const { dogId } = await insertDog(2, userId, dbPool);
      const { vetId } = await insertVet(3, dbPool);
      await dbInsertDogVetPreference(dbPool, dogId, vetId);
      const { callId } = await insertCall(
        dbPool,
        dogId,
        vetId,
        CALL_OUTCOME.APPOINTMENT,
      );
      const spec = getDbReportSpec(callId);
      const gen = await dbInsertReportAndUpdateCall(dbPool, spec);
      const sql = `select call_outcome as "callOutcome" from calls where call_id = $1`;
      const res = await dbQuery<{ callOutcome: CallOutcome }>(dbPool, sql, [
        callId,
      ]);
      expect(res.rows[0].callOutcome).toEqual(CALL_OUTCOME.REPORTED);
    });
  });
  it("should fail when call outcome is not initially APPOINTMENT", async () => {
    await withDb(async (dbPool) => {
      // GIVEN call that is DECLINED
      const { userId } = await insertUser(1, dbPool);
      const { dogId } = await insertDog(2, userId, dbPool);
      const { vetId } = await insertVet(3, dbPool);
      await dbInsertDogVetPreference(dbPool, dogId, vetId);
      const { callId } = await insertCall(
        dbPool,
        dogId,
        vetId,
        CALL_OUTCOME.DECLINED,
      );

      // WHEN attempting to add a report
      const spec = getDbReportSpec(callId);

      // THEN error is expected
      await expectError(async () => {
        await dbInsertReportAndUpdateCall(dbPool, spec);
      });

      // AND call outcome should still be DECLINED.
      const sql = `select call_outcome as "callOutcome" from calls where call_id = $1`;
      const res = await dbQuery<{ callOutcome: CallOutcome }>(dbPool, sql, [
        callId,
      ]);
      expect(res.rows[0].callOutcome).toEqual(CALL_OUTCOME.DECLINED);
    });
  });
});
