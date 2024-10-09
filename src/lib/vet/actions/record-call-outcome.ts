import { CODE } from "@/lib/utilities/bark-code";
import { VetActor } from "../vet-actor";
import { CALL_OUTCOME } from "@/lib/bark/enums/call-outcome";
import { Err, Ok, Result } from "@/lib/utilities/result";
import {
  dbBegin,
  dbCommit,
  dbRelease,
  dbResultQuery,
  dbRollback,
} from "@/lib/data/db-utils";
import { PoolClient } from "pg";

// STEP: Move recordCallOutcome into VetService
export async function recordCallOutcome(
  actor: VetActor,
  args: {
    dogId: string;
    callOutcome: typeof CALL_OUTCOME.APPOINTMENT | typeof CALL_OUTCOME.DECLINED;
  },
): Promise<
  Result<
    { callId: string },
    typeof CODE.ERROR_NOT_PREFERRED_VET | typeof CODE.DB_QUERY_FAILURE
  >
> {
  const { dogId, callOutcome } = args;
  const { dbPool, vetId } = actor.getParams();
  const conn = await dbPool.connect();
  try {
    const ctx = { actor, vetId, dogId, callOutcome, conn };
    await dbBegin(conn);
    const resPref = await checkPreferredVet(ctx);
    if (resPref !== CODE.OK) {
      return Err(resPref);
    }
    const { result, error } = await insertCallRecord(ctx);
    if (error !== undefined) {
      return Err(error);
    }
    await dbCommit(conn);
    return Ok(result);
  } finally {
    await dbRollback(conn);
    await dbRelease(conn);
  }
}

type Context = {
  actor: VetActor;
  vetId: string;
  dogId: string;
  callOutcome: typeof CALL_OUTCOME.APPOINTMENT | typeof CALL_OUTCOME.DECLINED;
  conn: PoolClient;
};

async function checkPreferredVet(
  ctx: Context,
): Promise<
  | typeof CODE.OK
  | typeof CODE.DB_QUERY_FAILURE
  | typeof CODE.ERROR_NOT_PREFERRED_VET
> {
  const { conn, dogId, vetId } = ctx;
  const sql = `
  SELECT 1
  FROM dog_vet_preferences
  WHERE dog_id = $1
  AND vet_id = $2
  `;
  const { result, error } = await dbResultQuery(conn, sql, [dogId, vetId]);
  if (error !== undefined) {
    return error;
  }
  if (result.rows.length !== 1) {
    return CODE.ERROR_NOT_PREFERRED_VET;
  }
  return CODE.OK;
}

async function insertCallRecord(
  ctx: Context,
): Promise<Result<{ callId: string }, typeof CODE.DB_QUERY_FAILURE>> {
  const { conn, dogId, vetId, callOutcome } = ctx;
  const sql = `
  INSERT INTO calls (
    dog_id,
    vet_id,
    call_outcome,
    encrypted_opt_out_reason
  )
  VALUES ($1, $2, $3, '')
  RETURNING call_id as "callId"
  `;
  const { result, error } = await dbResultQuery<{ callId: string }>(conn, sql, [
    dogId,
    vetId,
    callOutcome,
  ]);
  if (error !== undefined) {
    return Err(error);
  }
  if (result.rows.length !== 1) {
    return Err(CODE.DB_QUERY_FAILURE);
  }
  return Ok(result.rows[0]);
}
