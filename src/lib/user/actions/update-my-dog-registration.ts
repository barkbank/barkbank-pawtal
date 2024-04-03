import { dbBegin, dbCommit, dbQuery, dbRelease } from "@/lib/data/db-utils";
import { UserActor } from "../user-actor";
import { MyDogRegistrationUpdate } from "../user-models";
import { PoolClient } from "pg";

type Result = "OK_UPDATED" | "ERROR_REPORT_EXISTS" | "ERROR_UNAUTHORIZED";

type Context = {
  actor: UserActor;
  update: MyDogRegistrationUpdate;
};

export async function updateMyDogRegistration(
  actor: UserActor,
  update: MyDogRegistrationUpdate,
): Promise<Result> {
  const { dbPool } = actor.getParams();
  const ctx: Context = { actor, update };
  const conn = await dbPool.connect();
  try {
    await dbBegin(conn);
    const { isOwner } = await checkOwner(conn, ctx);
    if (!isOwner) {
      return "ERROR_UNAUTHORIZED";
    }
    await dbCommit(conn);
  } finally {
    await dbRelease(conn);
  }
  return "OK_UPDATED";
}

async function checkOwner(
  conn: PoolClient,
  ctx: Context,
): Promise<{ isOwner: boolean }> {
  const { actor, update } = ctx;
  const sql = `SELECT user_id as "ownerUserId" FROM dogs WHERE dog_id = $1`;
  const res = await dbQuery(conn, sql, [update.dogId]);
  if (res.rows.length === 0) {
    return { isOwner: false };
  }
  const { ownerUserId } = res.rows[0];
  const isOwner = actor.getUserId() === ownerUserId;
  return { isOwner };
}
