import { dbInsertDogVetPreference } from "@/lib/data/db-dogs";
import { withDb } from "../_db_helpers";
import {
  getDbReportSpec,
  insertCall,
  insertDog,
  insertUser,
  insertVet,
} from "../_fixtures";
import { CALL_OUTCOME } from "@/lib/models/bark-models";
import { dbInsertReport } from "@/lib/data/db-reports";

describe("dbInsertReport", () => {
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
      const gen = await dbInsertReport(dbPool, spec);
      expect(gen.dogId).toEqual(dogId);
      expect(gen.vetId).toEqual(vetId);
    });
  });
});
