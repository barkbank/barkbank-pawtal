import { DbCallGen, DbCallSpec } from "./db-models";
import { DbContext, dbQuery } from "./db-utils";

export async function dbInsertCall(
  dbCtx: DbContext,
  spec: DbCallSpec,
): Promise<DbCallGen> {
  const sql = `
  insert into calls (
    dog_id,
    vet_id,
    call_outcome,
    encrypted_opt_out_reason
  )
  values ($1, $2, $3, $4)
  returning
    call_id as "callId",
    call_creation_time as "callCreationTime"
  `;
  const res = await dbQuery(dbCtx, sql, [
    spec.dogId,
    spec.vetId,
    spec.callOutcome,
    spec.encryptedOptOutReason,
  ]);
  return res.rows[0] as DbCallGen;
}
