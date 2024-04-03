import { PoolClient } from "pg";
import { UserActor } from "../user-actor";
import { MyDogDetailsUpdate } from "../user-models";
import { dbBegin, dbCommit, dbQuery, dbRelease, dbRollback } from "@/lib/data/db-utils";

type Response =
  | "OK_UPDATED"
  | "ERROR_UNAUTHORIZED"
  | "ERROR_MISSING_DOG"
  | "ERROR_MISSING_REPORT"
  | "FAILURE_DB_UPDATE";

type Context = {
  actor: UserActor;
  update: MyDogDetailsUpdate;
};

export async function updateMyDogDetails(
  actor: UserActor,
  update: MyDogDetailsUpdate,
): Promise<Response> {
  const ctx: Context = { actor, update };
  const { dbPool } = actor.getParams();
  const conn = await dbPool.connect();
  try {
    await dbBegin(conn);
    const resOwnership = await checkOwnership(conn, ctx);
    if (resOwnership !== "OK") {
      return resOwnership;
    }
    await dbCommit(conn);
    return "OK_UPDATED";
  } finally {
    await dbRollback(conn);
    await dbRelease(conn);
  }
}

async function checkOwnership(
  conn: PoolClient,
  ctx: Context,
): Promise<"OK" | "ERROR_MISSING_DOG" | "ERROR_UNAUTHORIZED"> {
  const { actor, update } = ctx;
  const sql = `SELECT user_id as "ownerUserId" FROM dogs WHERE dog_id = $1`;
  const res = await dbQuery(conn, sql, [update.dogId]);
  if (res.rows.length === 0) {
    return "ERROR_MISSING_DOG";
  }
  const { ownerUserId } = res.rows[0];
  const isOwner = actor.getUserId() === ownerUserId;
  if (!isOwner) {
    return "ERROR_UNAUTHORIZED";
  }
  return "OK";
}
