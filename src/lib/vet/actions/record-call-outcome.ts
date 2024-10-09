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
import { CallDao } from "@/lib/bark/daos/call-dao";
import { CallSpec } from "@/lib/bark/models/call-models";

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
    const { callId } = await insertCallRecord(ctx);
    await dbCommit(conn);
    return Ok({ callId });
  } catch (err) {
    await dbRollback(conn);
    console.error(err);
    // WIP: Change this to CODE.FAILED;
    return Err(CODE.DB_QUERY_FAILURE);
  } finally {
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

async function insertCallRecord(ctx: Context): Promise<{ callId: string }> {
  const { conn, dogId, vetId, callOutcome } = ctx;
  const dao = new CallDao(conn);
  const spec: CallSpec = { dogId, vetId, callOutcome };
  const { callId } = await dao.insert({ spec });
  return { callId };
}
