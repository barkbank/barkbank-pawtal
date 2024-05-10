import { dbInsertDogVetPreference } from "@/lib/data/db-dogs";
import { withDb } from "../_db_helpers";
import { getVetActor, insertDog, insertUser, insertVet } from "../_fixtures";
import { recordCallOutcome } from "@/lib/vet/actions/record-call-outcome";
import { CALL_OUTCOME, CallOutcome } from "@/lib/data/db-enums";
import { CODE } from "@/lib/utilities/bark-code";
import { dbResultQuery } from "@/lib/data/db-utils";
import { Pool } from "pg";

describe("recordCallOutcome", () => {
  it("should return ERROR_NOT_PREFERRED_VET if vet is not the preferred vet of the dog", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const d1 = await insertDog(1, u1.userId, dbPool);
      const v1 = await insertVet(1, dbPool);
      const v2 = await insertVet(2, dbPool);
      await dbInsertDogVetPreference(dbPool, d1.dogId, v2.vetId);

      const actor = getVetActor(v1.vetId, dbPool);
      const { result, error } = await recordCallOutcome(actor, {
        dogId: d1.dogId,
        callOutcome: CALL_OUTCOME.APPOINTMENT,
      });
      expect(error).toEqual(CODE.ERROR_NOT_PREFERRED_VET);
      expect(result).toBeUndefined();
    });
  });
  it("should record APPOINTMENT call outcomes", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const d1 = await insertDog(1, u1.userId, dbPool);
      const v1 = await insertVet(1, dbPool);
      await dbInsertDogVetPreference(dbPool, d1.dogId, v1.vetId);

      const actor = getVetActor(v1.vetId, dbPool);
      const { result, error } = await recordCallOutcome(actor, {
        dogId: d1.dogId,
        callOutcome: CALL_OUTCOME.APPOINTMENT,
      });
      expect(error).toBeUndefined();
      const { callId } = result!;
      const callOutcome = await getCallOutcome(dbPool, callId);
      expect(callOutcome).toEqual(CALL_OUTCOME.APPOINTMENT);
    });
  });
  it("should record DECLINED call outcomes", async () => {
    await withDb(async (dbPool) => {
      const u1 = await insertUser(1, dbPool);
      const d1 = await insertDog(1, u1.userId, dbPool);
      const v1 = await insertVet(1, dbPool);
      await dbInsertDogVetPreference(dbPool, d1.dogId, v1.vetId);

      const actor = getVetActor(v1.vetId, dbPool);
      const { result, error } = await recordCallOutcome(actor, {
        dogId: d1.dogId,
        callOutcome: CALL_OUTCOME.DECLINED,
      });
      expect(error).toBeUndefined();
      const { callId } = result!;
      const callOutcome = await getCallOutcome(dbPool, callId);
      expect(callOutcome).toEqual(CALL_OUTCOME.DECLINED);
    });
  });
});

async function getCallOutcome(
  dbPool: Pool,
  callId: string,
): Promise<CallOutcome | null> {
  const sql = `
  SELECT call_outcome as "callOutcome"
  FROM calls
  WHERE call_id = $1
  `;
  const { result, error } = await dbResultQuery<{ callOutcome: CallOutcome }>(
    dbPool,
    sql,
    [callId],
  );
  if (error !== undefined) {
    return null;
  }
  const { callOutcome } = result.rows[0];
  return callOutcome;
}
